import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { isLoggedIn } = useSelector((state) => state.user);

  const [orders, setOrders] = useState("");

  const [account, setAccount] = useState("");
  const [userComments, setUserComments] = useState("");

  const [Products, setProducts] = useState("");
  const [adminData, setAdminData] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`${process.env.REACT_APP_BASE_API_URL}/admin`).then((response) => setAdminData(response.data));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`${process.env.REACT_APP_BASE_API_URL}/comments?name=${isLoggedIn.fullName}`).then((response) => setUserComments(response.data));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`${process.env.REACT_APP_BASE_API_URL}/products`).then((response) => {
        !Products && setProducts(response.data);
      });
    }
  }, [isLoggedIn, setProducts, Products]);

  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`${process.env.REACT_APP_BASE_API_URL}/orders`).then((response) => {
        const order = response.data.filter((order) => order.id.includes(isLoggedIn.email));
        setOrders(order);
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`${process.env.REACT_APP_BASE_API_URL}/accounts`).then((response) => {
        const data = response.data;
        const User = data.find((item) => item.email === isLoggedIn.email);
        setAccount(User);
      });
    }
  }, [isLoggedIn]);

  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");

  const addressHandler = (event) => {
    setAddress(event.target.value);
  };

  const zipCodeHandler = (event) => {
    setZipCode(event.target.value);
  };

  const phoneHandler = (event) => {
    setPhone(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!address || !zipCode || !phone) {
      alert("To Update Your Info, Please Fill All Fields!");
    } else {
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
      alert("Shipping Info Updated.");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.orders}>
          {orders && (
            <div>
              <h3>Previous Orders</h3>
              {orders.map((item, index) => (
                <div key={index}>
                  <p className={styles.order}>
                    Ordered ({Number(item.total) + Number(adminData[0].tax) + Number(adminData[0].shippingCostMethodOne)} in total including tax and shipping costs) in {item.orderDate} at{" "}
                    {item.orderTime}
                  </p>
                  <p className={styles.orderDetails}>
                    {item.orderInfo.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}{" "}
                  </p>
                  <p className={styles.orderstat}>
                    Order is {item.paid ? "paid" : "canceled because of failed payment!"} {item.prepared && "and prepared"} {item.sent && " and soon will be with you."}{" "}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.comments}>
          <div>
            <h3>Your Comments</h3>
            {userComments &&
              userComments.map((item, index) => (
                <p key={index}>
                  You commented <span>{item.comment}</span> on product <Link to={`/shop/${item.forId}`}>{item.forTitle}</Link>
                  <p className={styles.comApprove}>{item.approved ? "Approved" : "Waiting fot Approval"}</p>
                </p>
              ))}
          </div>
        </div>

        <div className={styles.info}>
          <h3>Enter Your Shipping Info or Update them.</h3>

          {isLoggedIn && (
            <form onSubmit={submitHandler}>
              <div>
                <span>Address: </span>
                <input className={styles.input} placeholder={"Address"} value={address} onChange={addressHandler} />
                <p>{account.address}</p>
              </div>
              <div>
                <span>Zip Code: </span>
                <input className={styles.input} placeholder={"Zip Code"} value={zipCode} onChange={zipCodeHandler} />
                <p>{account.zipCode}</p>
              </div>
              <div>
                <span>Phone Number: </span>
                <input className={styles.input} placeholder={"Phone Number"} value={phone} onChange={phoneHandler} />
                <p>{account.phone}</p>
              </div>
              <button type="submit">Update</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
