import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { authentication } from "../functions/formValidation";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../redux/account/userAction";

import styles from "./accounts.module.css";

const Login = () => {
  const success = useRef();
  const failed = useRef();
  const form = useRef();

  const navigate = useNavigate();

  const { isLoggedIn } = useSelector((state) => state.user);
  const [account, setAccount] = useState("");

  const dispatch = useDispatch();

  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/Dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setErrors(authentication(data, "LOGIN"));
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
      if (User) {
        if (User.password === data.password) {
          if (User.emailVerified) {
            dispatch(loginSuccess(User));
            success.current.textContent = "Login Successful.";
            failed.current.textContent = "";
            navigate("/Dashboard", { replace: true });
          } else {
            dispatch(loginFailure());
            success.current.textContent = "";
            failed.current.textContent = "Please Check Your Email to Verify Your Account.";

            if (data.email) {
              const text = "Please Follow the Link to Verify Your Email Address:";
              const emailBody = `${text} ${process.env.REACT_APP_BASE_URL}/EmailVerification?email=${data.email}`;
              axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/send_mail`, {
                text: emailBody,
                to: data.email,
                subject: "Email Verification",
              });
            }
          }
        } else {
          success.current.textContent = "";
          failed.current.textContent = "Wrong Email or Password!";
        }
      } else {
        success.current.textContent = "";
        failed.current.textContent = "Wrong Email or Password!";
      }
    } else {
      setTouched({ email: true, password: true });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form ref={form} onSubmit={submitHandler}>
          <h2 className={styles.accountsTitle}>Login</h2>
          <p className={styles.accountsHelp}>Please Enter Your Email and Password.</p>

          <div>
            <input className={styles.formControl} type="email" name="email" placeholder="Email" value={data.email} onChange={changeHandler} onFocus={focusHandler} />
            <p className={styles.errors}>{errors.email && touched.email && errors.email}</p>
          </div>
          <div>
            <input className={styles.formControl} type="password" name="password" placeholder="Password" value={data.password} onChange={changeHandler} onFocus={focusHandler} />
            <p className={styles.errors}>{errors.password && touched.password && errors.password}</p>
          </div>

          <button className={styles.btn} type="submit">
            Login
          </button>

          <div className={styles.result}>
            <span className={styles.failed} ref={failed}></span>
            <span className={styles.success} ref={success}></span>
          </div>

          <div>
            <Link className={styles.a} to="/ForgotPassword">
              Forgot Password
            </Link>
          </div>
          <div className={styles.accounts}>
            <span style={{ fontWeight: "normal", color: "#000" }}>Don't Have an Account? </span>
            <Link className={styles.a} to="/Register">
              Register
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
