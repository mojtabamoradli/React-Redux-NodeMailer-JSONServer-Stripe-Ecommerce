import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// import { auth, forgotPasswordSuccess, forgotPasswordFailure } from "../redux/account/userAction";
import { forgotPasswordSuccess } from "../redux/account/userAction";

import { authentication } from "../functions/formValidation";

import styles from "./accounts.module.css";
import axios from "axios";

const ForgotPassword = () => {
  const form = useRef();

  const navigate = useNavigate();

  const success = useRef();
  const failed = useRef();

  const { isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [data, setData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [account, setAccount] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/Dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setErrors(authentication(data, "FORGOT_PASSWORD"));
  }, [data, touched]);

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/accounts`).then((response) => {
      setAccount(response.data);
    });
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();
    if (!Object.keys(errors).length) {
      const User = account.find((item) => item.email === data.email);
      if (!User) {
        failed.current.textContent = "Wrong Email!";
        success.current.textContent = "";
      } else {
        success.current.textContent = "Please Check Your Email to Recover Your Account.";
        failed.current.textContent = "";
        dispatch(forgotPasswordSuccess());

        if (data.email) {
          const text = "Please Follow the Link to Reset Your Password:";
          const emailBody = `${text} ${process.env.REACT_APP_BASE_URL}/ResetPassword?email=${data.email}`;
          axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/send_mail`, {
            text: emailBody,
            to: data.email,
            subject: "Reset Password",
          });
        }
      }
    } else {
      setTouched({ email: true });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form ref={form} onSubmit={submitHandler}>
          <h2 className={styles.accountsTitle}>Forgot Password</h2>
          <p className={styles.accountsHelp}>Enter your email.</p>

          <div>
            <input className={styles.formControl} type="email" name="email" placeholder="Email" value={data.email} onChange={changeHandler} onFocus={focusHandler} />
            <p className={styles.errors}>{errors.email && touched.email && errors.email}</p>
          </div>

          <button className={styles.btn} type="submit">
            Recover Account
          </button>
          <div className={styles.result}>
            <span className={styles.failed} ref={failed}></span>
            <span className={styles.success} ref={success}></span>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
