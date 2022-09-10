import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Cart from "./Cart";

import styles from "./ShopCart.module.css";

import { clear } from "../redux/cart/cartAction";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const ShopCart = () => {
  var today = new Date();
  var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  const dispatch = useDispatch();
  const state = useSelector((state) => state.cartState);
  const { isLoggedIn } = useSelector((state) => state.user);

  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const [coupon, setCoupon] = useState("");
  const [account, setAccount] = useState("");
  const [variable, setVariable] = useState("");

  const [showStripe, setShowStripe] = useState(false);

  const stripeSuccess = useRef();
  const stripeFailure = useRef();

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`${process.env.REACT_APP_BASE_API_URL}/accounts`).then((response) => {
        const data = response.data;
        const User = data.find((item) => item.email === isLoggedIn.email);
        setAccount(User);
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/admin`).then((response) => {
      response.data.map((item) => setVariable(item));
    });
  }, []);

  const [address, setAddress] = useState(account.address);
  const [zipCode, setZipCode] = useState(account.zipCode);
  const [phone, setPhone] = useState(account.phone);

  const couponHandler = (event) => {
    setCoupon(event.target.value);
  };

  const addressHandler = (event) => {
    setAddress(event.target.value);
  };

  const zipCodeHandler = (event) => {
    setZipCode(event.target.value);
  };

  const phoneHandler = (event) => {
    setPhone(event.target.value);
  };

  const stripeHandler = async (event) => {
    event.preventDefault();
    if (!account.address && !account.zipCode && !account.phone) {
      axios
        .put(`${process.env.REACT_APP_BASE_API_URL}/accounts/${isLoggedIn.id}`, {
          fullName: isLoggedIn.fullName,
          email: isLoggedIn.email,
          password: isLoggedIn.password,
          emailVerified: isLoggedIn.emailVerified,
          address: address,
          zipCode: zipCode,
          phone: phone,
        })
        .then((response) => response.data);
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!account.address && !address && !account.zipCode && !zipCode && !account.phone && !phone) {
      stripeFailure.current.textContent = "Please Provide Your Address, Zip Code and Phone Number.";
      stripeSuccess.current.textContent = "";
    } else {
      if (!error) {
        try {
          setPaying(true);
          const { id } = paymentMethod;
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/payment`, {
            amount: Math.round(
              (coupon === variable.couponCode
                ? state.total - (variable.couponPercent * 0.01 * state.total).toFixed(2) + Number(variable.tax) + Number(variable.shippingCostMethodOne)
                : Number(state.total) + Number(variable.tax) + Number(variable.shippingCostMethodOne)) * 100
            ),
            id,
          });

          if (response.data.success) {
            stripeFailure.current.textContent = "";
            stripeSuccess.current.textContent = "Payment Successful 🥳";
            setPaying(false);
            setPaid(true);

            axios
              .post(`${process.env.REACT_APP_BASE_API_URL}/orders`, {
                id: isLoggedIn.email + date + time,
                orderDate: date,
                orderTime: time,
                paid: true,
                prepared: false,
                sent: false,
                fullName: isLoggedIn.fullName,
                email: isLoggedIn.email,
                phone: account.phone,
                address: account.address,
                zipCode: account.zipCode,
                total: state.total,
                orderInfo: state.selectedItems.map((i) => `productId: ${i.id} | Quantity: ${i.quantity} | product: ${i.title} | realPrice: ${i.price} | offPercent: ${i.off_percent}`),
              })
              .then((response) => response.data);

            const emailBody = `Order Id:${isLoggedIn.email}${date}${time} <----------->
                                    Order Date: ${date} <----------->
                                     Order Time: ${time} <----------->
                                    Total: ${Number(state.total) + Number(variable.tax) + Number(variable.shippingCostMethodOne)} <----------->
                                    Order Info: ${state.selectedItems.map(
                                      (i) => `productId: ${i.id} | Quantity: ${i.quantity} | product: ${i.title} | realPrice: ${i.price} | offPercent: ${i.off_percent} <------>`
                                    )}
                                    `;
            axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/send_mail`, {
              text: emailBody,
              to: isLoggedIn.email,
              subject: "Order Receipt",
            });

            dispatch(clear());
          }
        } catch (error) {
          console.log("Error", error);
          stripeFailure.current.textContent = `${error}`;
          stripeSuccess.current.textContent = "";
          setPaying(false);
        }
      } else {
        stripeFailure.current.textContent = `${error.message}`;
        stripeSuccess.current.textContent = "";
        setPaying(false);
      }
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.cartContainer}>
          {state.selectedItems.map((item) => (
            <Cart key={item.id} data={item} />
          ))}
        </div>

        {state.itemsCounter > 0 && (
          <div className={styles.payments}>
            <p>
              <span>Total Items:</span> {state.itemsCounter}
            </p>
            <p>
              <span>Coupon Code:</span> <input className={styles.input} type="text" placeholder=" Coupon Code" value={coupon} onChange={couponHandler} />
            </p>
            {coupon !== variable.couponCode && (
              <p>
                Enter {variable.couponCode} for {variable.couponPercent}% off on your total (Minus Tax & Shipping Cost)
              </p>
            )}
            {coupon === variable.couponCode && <p>You saved ${(variable.couponPercent * 0.01 * state.total).toFixed(2)}</p>}
            <p>
              <span>Tax:</span> ${variable.tax}
            </p>
            <p>
              <span>Shipping Cost:</span> ${variable.shippingCostMethodOne}
            </p>
            <p>
              <span>Shipping:</span> {variable.shippingMethodOne}
            </p>

            {isLoggedIn && (
              <>
                <p>
                  <span>Address: </span>
                  {account.address ? account.address : <input className={styles.input} placeholder={" Address"} value={account.address ? account.address : address} onChange={addressHandler} />}
                </p>
                <p>
                  <span>Zip Code: </span>
                  {account.zipCode ? account.zipCode : <input className={styles.input} placeholder={" Zip Code"} value={account.zipCode ? account.zipCode : zipCode} onChange={zipCodeHandler} />}
                </p>
                <p>
                  <span>Phone Number: </span>
                  {account.phone ? account.phone : <input className={styles.input} placeholder={" Phone Number"} value={account.phone ? account.phone : phone} onChange={phoneHandler} />}
                </p>
                {account.address && account.zipCode && account.phone && <p>For Changing or Updating Your Address, Please Navigate to Your Dashboard.</p>}
                <p>
                  <span>Email: </span> {isLoggedIn.email}
                </p>
                <p>
                  <span>You can expect to recieve your package in</span> 3 days<span>.</span>
                </p>
              </>
            )}

            <p>
              <span>Total Payments: </span>$
              {coupon === variable.couponCode
                ? state.total - (variable.couponPercent * 0.01 * state.total).toFixed(2) + Number(variable.tax) + Number(variable.shippingCostMethodOne)
                : Math.round(Number(state.total) + Number(variable.tax) + Number(variable.shippingCostMethodOne))}
            </p>
            <p>
              <Link to="/Terms">Our Company Pricing Terms & Policies</Link>
            </p>

            <div className={styles.buttonContainer}>
              <button className={styles.clear} onClick={() => dispatch(clear())}>
                Clear
              </button>

              {/* <button className={styles.checkout} onClick={() => dispatch(checkout())}>Checkout</button> */}
              {!isLoggedIn && (
                <Link to="/login">
                  <button className={styles.checkout}>Login to Pay</button>
                </Link>
              )}

              {isLoggedIn && (
                <button className={styles.checkout} onClick={() => setShowStripe(true)}>
                  {paid ? "Paid" : "Pay via Stripe"}
                </button>
              )}
            </div>

            {showStripe && (
              <>
                {!paid && (
                  <form className={styles.stripe} onSubmit={stripeHandler}>
                    <CardElement />
                    {paying ? (
                      <button className={styles.paybutton} disabled>
                        Paying
                      </button>
                    ) : (
                      <button className={styles.paybutton}>Pay</button>
                    )}
                  </form>
                )}

                <div>
                  <p className={styles.stripeSuccessp} ref={stripeSuccess}></p>
                  <p className={styles.stripeFailurep} ref={stripeFailure}></p>
                </div>
              </>
            )}
          </div>
        )}

        {state.itemsCounter === 0 && !state.checkout && (
          <div className={styles.complete}>
            {paid && <h2 className={styles.stripeSuccess}>Payment Successful 🥳</h2>}
            <h3>Want to buy?</h3>
            <Link to="/shop">Go to shop</Link>
          </div>
        )}
        {state.checkout && (
          <div className={styles.complete}>
            <h3>Your Cart Is Empty!</h3>
            <Link to="/shop">Buy</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default ShopCart;
