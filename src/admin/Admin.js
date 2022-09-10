import React, { useEffect, useRef, useState } from "react";
import styles from "./Admin.module.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { logoutSuccess } from "../redux/account/userAction";
import { authentication } from "../functions/formValidation";

const Admin = () => {
  const dispatch = useDispatch();

  const [orders, setOrders] = useState("");

  const [admin, setAdmin] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [variable, setVariable] = useState("");

  const [comments, setComments] = useState("");
  const [commentToDelete, setCommentToDelete] = useState("");
  const [approveComment, setApproveComment] = useState("");

  // updating Product
  // remove the the on page product from similar producs
  // Advanced Search
  // Compare
  // picking different product features

  useEffect(() => {
    dispatch(logoutSuccess());
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/admin`).then((response) => {
      response.data.map((item) => setVariable(item));
    });
  }, [dispatch]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/orders`).then((response) => setOrders(response.data));
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/comments`).then((response) => setComments(response.data));
  }, []);

  const preparedHandler = () => {
    const RightOrder = orders.find((i) => i.id === orderId);
    RightOrder &&
      axios
        .put(`${process.env.REACT_APP_BASE_API_URL}/orders/${RightOrder.id}`, {
          id: RightOrder.id,
          orderDate: RightOrder.orderDate,
          orderTime: RightOrder.orderTime,
          paid: RightOrder.paid,
          prepared: true,
          sent: RightOrder.sent,
          fullName: RightOrder.fullName,
          email: RightOrder.email,
          phone: RightOrder.phone,
          address: RightOrder.address,
          zipCode: RightOrder.zipCode,
          total: Number(RightOrder.total) + Number(variable.tax) + Number(variable.shippingCostMethodOne),
          orderInfo: RightOrder.orderInfo,
        })
        .then((response) => response.data);

    if (RightOrder) {
      const text = "Your Order Prepared by Ecommerce and Soon Will be with You.";
      const emailBody = `${text} ${process.env.REACT_APP_BASE_URL}/Dashboard`;
      axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/send_mail`, {
        text: emailBody,
        to: RightOrder.email,
        subject: "Order Status",
      });
    }
  };

  const sendHandler = () => {
    const RightOrder = orders.find((i) => i.id === orderId);
    RightOrder &&
      axios
        .put(`${process.env.REACT_APP_BASE_API_URL}/orders/${RightOrder.id}`, {
          id: RightOrder.id,
          orderDate: RightOrder.orderDate,
          orderTime: RightOrder.orderTime,
          paid: RightOrder.paid,
          prepared: RightOrder.prepared,
          sent: true,
          fullName: RightOrder.fullName,
          email: RightOrder.email,
          phone: RightOrder.phone,
          address: RightOrder.address,
          zipCode: RightOrder.zipCode,
          total: Number(RightOrder.total) + Number(variable.tax) + Number(variable.shippingCostMethodOne),
          orderInfo: RightOrder.orderInfo,
        })
        .then((response) => response.data);

    if (RightOrder) {
      const text = "Your Order Is on the Way.";
      const emailBody = `${text} ${process.env.REACT_APP_BASE_URL}/Dashboard`;
      axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/send_mail`, {
        text: emailBody,
        to: RightOrder.email,
        subject: "Order Status",
      });
    }
  };

  const [tax, setTax] = useState("");
  const [shippingMethodOne, setShippingMethodOne] = useState("");
  const [shippingCostMethodOne, setShippingCostMethodOne] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponPercent, setCouponPercent] = useState("");

  const taxHandler = (event) => {
    setTax(event.target.value);
  };
  const shippingMethodOneHandler = (event) => {
    setShippingMethodOne(event.target.value);
  };
  const shippingCostMethodOneHandler = (event) => {
    setShippingCostMethodOne(event.target.value);
  };
  const couponCodeHandler = (event) => {
    setCouponCode(event.target.value);
  };
  const couponPercentHandler = (event) => {
    setCouponPercent(event.target.value);
  };
  const serviceSubmitHandler = (event) => {
    event.preventDefault();
    if (!tax || !shippingMethodOne || !shippingCostMethodOne || !couponCode || !couponPercent) {
      alert("Please Fill All Fields!");
    } else {
      axios
        .put(`${process.env.REACT_APP_BASE_API_URL}/admin/1`, {
          id: 1,
          tax: tax,
          shippingCostMethodOne: shippingCostMethodOne,
          couponCode: couponCode,
          couponPercent: couponPercent,
          shippingMethodOne: shippingMethodOne,
        })
        .then((response) => response.data);
      alert("Service Info Updated.");
    }
  };

  const [title, setTitle] = useState("");
  const [price, setOrice] = useState("");
  const [off_percent, setOff_percent] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [rate, setRate] = useState("");
  const [count, setCount] = useState("");

  const titleHandler = (event) => {
    setTitle(event.target.value);
  };
  const priceHandler = (event) => {
    setOrice(event.target.value);
  };
  const off_percentHandler = (event) => {
    setOff_percent(event.target.value);
  };
  const descriptionHandler = (event) => {
    setDescription(event.target.value);
  };
  const categoryHandler = (event) => {
    setCategory(event.target.value);
  };
  const image1Handler = (event) => {
    setImage1(event.target.value);
  };
  const image2Handler = (event) => {
    setImage2(event.target.value);
  };
  const image3Handler = (event) => {
    setImage3(event.target.value);
  };
  const rateHandler = (event) => {
    setRate(event.target.value);
  };
  const countHandler = (event) => {
    setCount(event.target.value);
  };

  const productAddSubmitHandler = (event) => {
    event.preventDefault();
    if (!title || !price || !off_percent || !description || !category || !image1 || !rate || !count) {
      alert("Please Fill All Fields!");
    } else {
      axios
        .post(`${process.env.REACT_APP_BASE_API_URL}/products`, {
          title: title,
          price: price,
          off_percent: off_percent,
          description: description,
          category: category,
          album: [{ image: image1 }, { image: image2 }, { image: image3 }],
          rate: rate,
          count: count,
        })
        .then((response) => response.data);
      alert("Product Added.");
    }
  };

  const [id, setId] = useState("");

  const idHandler = (event) => {
    setId(event.target.value);
  };

  const productDeleteSubmitHandler = (event) => {
    event.preventDefault();
    if (!id) {
      alert("Please Enter an Id!");
    } else {
      axios.delete(`${process.env.REACT_APP_BASE_API_URL}/products/${id}`);
      alert("Product Deleted.");
    }
  };

  const commentDeleteHandler = () => {
    axios.delete(`${process.env.REACT_APP_BASE_API_URL}/comments/${commentToDelete}`);
    // alert("Comment Deleted.");
  };

  const approveCommentHandler = () => {
    const RightComment = comments.find((i) => i.id === approveComment);
    RightComment &&
      axios
        .put(`${process.env.REACT_APP_BASE_API_URL}/comments/${RightComment.id}`, {
          id: RightComment.id,
          name: RightComment.name,
          comment: RightComment.comment,
          forId: RightComment.forId,
          forTitle: RightComment.forTitle,
          approved: true,
        })
        .then((response) => response.data);
  };

  const failed = useRef();

  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (admin) {
      setAdmin(true);
    }
  }, [admin]);

  useEffect(() => {
    setErrors(authentication(data, "LOGIN"));
  }, [data, touched]);

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const clickHandler = (event) => {
    event.preventDefault();
    if (!Object.keys(errors).length) {
      if (data.email === process.env.REACT_APP_ADMIN_LOGIN_EMAIL && data.password === process.env.REACT_APP_ADMIN_PASSWORD) {
        setAdmin(true);
        failed.current.textContent = "";
      } else {
        failed.current.textContent = "Wrong Email or Password!";
      }
    } else {
      setTouched({ email: true, password: true });
    }
  };

  console.log(admin);

  return (
    <>
      {" "}
      {admin ? (
        <div>
          <div className={styles.mainContainer}>
            <div>
              <div style={{ marginBottom: "20px", color: "#1a73e8" }}>
                <h3>Admin Panel</h3>
              </div>
              <h3>Updating Services & Prices</h3>
              <form onSubmit={serviceSubmitHandler}>
                <p>
                  <span>Tax: </span>${variable.tax}
                </p>
                <input className={styles.input} placeholder=" Tax" value={tax} onChange={taxHandler} />
                <p>
                  <span>Shipping Method: </span>
                  {variable.shippingMethodOne}
                </p>
                <input className={styles.input} placeholder=" Shipping Method" value={shippingMethodOne} onChange={shippingMethodOneHandler} />
                <p>
                  <span>Shipping Cost: </span>${variable.shippingCostMethodOne}
                </p>
                <input className={styles.input} placeholder=" Shipping Cost" value={shippingCostMethodOne} onChange={shippingCostMethodOneHandler} />
                <p>
                  <span>Coupon Code: </span>
                  {variable.couponCode}
                </p>
                <input className={styles.input} placeholder=" Coupon Code" value={couponCode} onChange={couponCodeHandler} />
                <p>
                  <span>Coupon Percent: </span>
                  {variable.couponPercent}%
                </p>
                <input className={styles.input} placeholder=" Coupon Percent" value={couponPercent} onChange={couponPercentHandler} />
                <button type="submit">Update</button>
              </form>

              <h3 style={{ marginTop: "20px" }}>Adding Product</h3>
              <form onSubmit={productAddSubmitHandler}>
                <input className={styles.input} placeholder=" Title" value={title} onChange={titleHandler} />
                <input className={styles.input} placeholder=" Price" value={price} onChange={priceHandler} />
                <input className={styles.input} placeholder=" Off Percent" value={off_percent} onChange={off_percentHandler} />
                <input className={styles.input} placeholder=" Description" value={description} onChange={descriptionHandler} />
                <input className={styles.input} placeholder=" Category" value={category} onChange={categoryHandler} />
                <input className={styles.input} placeholder=" Face Image URL" value={image1} onChange={image1Handler} />
                <input className={styles.input} placeholder=" Additional Image URL" value={image2} onChange={image2Handler} />
                <input className={styles.input} placeholder=" Additional Image URL" value={image3} onChange={image3Handler} />
                <input className={styles.input} placeholder=" Rate" value={rate} onChange={rateHandler} />
                <input className={styles.input} placeholder=" Count" value={count} onChange={countHandler} />
                <button type="submit">Add Product</button>
              </form>

              <h3 style={{ marginTop: "20px" }}>Deleting Product</h3>
              <form onSubmit={productDeleteSubmitHandler}>
                <p>Enter the Id of the product you want to delete.</p>
                <input className={styles.input} placeholder=" Product Id" value={id} onChange={idHandler} />
                <button type="submit">Delete Product</button>
              </form>

              <h3 style={{ marginTop: "20px" }}>Comments</h3>

              {comments &&
                comments.map((item, index) => (
                  <p key={item.index}>
                    <span>{item.name}</span> commented ({item.comment}) on <Link to={`/shop/${item.forId}`}>{item.forTitle}</Link>{" "}
                    {item.approved ? (
                      <>
                        <span style={{ color: "orange" }}>Approved</span>{" "}
                        <button
                          onClick={() => {
                            setCommentToDelete(item.id);
                            commentDeleteHandler();
                          }}
                        >
                          Double Click to Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <span style={{ color: "orange" }}>Waiting for Approval</span>
                        <button
                          onClick={() => {
                            setApproveComment(item.id);
                            approveCommentHandler();
                          }}
                        >
                          Double Click to Approve
                        </button>
                      </>
                    )}
                  </p>
                ))}
            </div>

            <div>
              <h2>Pending Orders</h2>
              {orders &&
                orders.map(
                  (item, index) =>
                    item.paid &&
                    !item.prepared &&
                    !item.sent && (
                      <div style={{ marginTop: "20px", marginBottom: "20px" }} key={index}>
                        <p style={{ color: "#000", fontWeight: "bold", marginBottom: "20px" }}>Order {index + 1} </p>
                        <p style={{ color: "#167d32", fontWeight: "bold", marginBottom: "10px", marginTop: "10px" }}>
                          Ordered ({Number(item.total) + Number(variable.tax) + Number(variable.shippingCostMethodOne)} in total including tax and shipping costs) in {item.orderDate} at{" "}
                          {item.orderTime}
                        </p>
                        <p style={{ color: "orange", marginTop: "10px", marginBottom: "10px" }}>
                          {item.fullName} {item.address} {item.zipCode} {item.phone}
                        </p>
                        <p style={{ fontSize: "15px" }}>
                          {item.orderInfo.map((item, index) => (
                            <p style={{ justifyContent: "left" }} key={index}>
                              {item}
                            </p>
                          ))}
                        </p>
                        <div>
                          <div>
                            <button
                              onClick={() => {
                                setOrderId(item.id);
                                preparedHandler();
                              }}
                            >
                              Double Click to Change Order Status to prepared
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                )}
            </div>

            <div>
              <h2>Prepared Orders</h2>
              {orders &&
                orders.map(
                  (item, index) =>
                    item.prepared &&
                    !item.sent && (
                      <div style={{ marginTop: "20px", marginBottom: "20px" }} key={index}>
                        <p style={{ color: "#000", fontWeight: "bold", marginBottom: "20px" }}>Order {index + 1} </p>
                        <p style={{ color: "#167d32", fontWeight: "bold", marginBottom: "10px", marginTop: "10px" }}>
                          Ordered ({Number(item.total) + Number(variable.tax) + Number(variable.shippingCostMethodOne)} in total including tax and shipping costs) in {item.orderDate} at{" "}
                          {item.orderTime}
                        </p>
                        <p style={{ color: "orange", marginTop: "10px", marginBottom: "10px" }}>
                          {item.fullName} {item.address} {item.zipCode} {item.phone}
                        </p>
                        <p style={{ fontSize: "15px" }}>
                          {item.orderInfo.map((item, index) => (
                            <p style={{ justifyContent: "left" }} key={index}>
                              {item}
                            </p>
                          ))}
                        </p>
                        <div>
                          <button
                            onClick={() => {
                              setOrderId(item.id);
                              sendHandler();
                            }}
                          >
                            Double Click to Change Order Status to send
                          </button>
                        </div>
                      </div>
                    )
                )}
            </div>

            <div>
              <h2>Sent Orders</h2>
              {orders &&
                orders.map(
                  (item, index) =>
                    item.prepared &&
                    item.sent && (
                      <div style={{ marginTop: "20px", marginBottom: "20px" }} key={index}>
                        <p style={{ color: "#000", fontWeight: "bold", marginBottom: "20px" }}>Order {index + 1} </p>
                        <p style={{ color: "#167d32", fontWeight: "bold", marginBottom: "10px", marginTop: "10px" }}>
                          Ordered ({Number(item.total) + Number(variable.tax) + Number(variable.shippingCostMethodOne)} in total including tax and shipping costs) in {item.orderDate} at{" "}
                          {item.orderTime}
                        </p>
                        <p style={{ color: "orange", marginTop: "10px", marginBottom: "10px" }}>
                          {item.fullName} {item.address} {item.zipCode} {item.phone}
                        </p>
                        <p style={{ fontSize: "15px" }}>
                          {item.orderInfo.map((item, index) => (
                            <p style={{ justifyContent: "left" }} key={index}>
                              {item}
                            </p>
                          ))}
                        </p>
                      </div>
                    )
                )}
            </div>

            <div>
              <h2>Canceled Orders</h2>
              {orders &&
                orders.map(
                  (item, index) =>
                    !item.paid && (
                      <div style={{ marginTop: "20px", fontSize: "15px" }} key={index}>
                        <p style={{ color: "#B33B3B", fontWeight: "bold" }}>Canceled Order because of failed payment!</p>
                        <p style={{ color: "#B3BBC5", marginTop: "10px", marginBottom: "10px" }}>
                          {item.fullName} {item.address} {item.zipCode} {item.phone}
                        </p>
                        <p style={{ marginTop: "10px", marginBottom: "10px" }}>
                          {item.orderInfo.map((item, index) => (
                            <p style={{ justifyContent: "left" }} key={index}>
                              {item}
                            </p>
                          ))}
                        </p>
                        <p style={{ color: "orange", fontWeight: "bold" }}>
                          Ordered ({Number(item.total) + Number(variable.tax) + Number(variable.shippingCostMethodOne)} in total including tax and shipping costs) in {item.orderDate} at{" "}
                          {item.orderTime}
                        </p>
                      </div>
                    )
                )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <form>
            <h2 className={styles.accountsTitle}>Admin Login</h2>
            <p className={styles.accountsHelp}>Please Enter Administrative Email and Password.</p>

            <div>
              <input className={styles.formControl} type="email" name="email" placeholder="Email" value={data.email} onChange={changeHandler} onFocus={focusHandler} />
              <p className={styles.errors}>{errors.email && touched.email && errors.email}</p>
            </div>
            <div>
              <input className={styles.formControl} type="password" name="password" placeholder="Password" value={data.password} onChange={changeHandler} onFocus={focusHandler} />
              <p className={styles.errors}>{errors.password && touched.password && errors.password}</p>
            </div>

            <button onClick={clickHandler} className={styles.btn} type="submit">
              Login
            </button>

            <div className={styles.result}>
              <span className={styles.failed} ref={failed}></span>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Admin;
