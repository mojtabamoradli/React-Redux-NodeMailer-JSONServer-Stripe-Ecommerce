import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authentication } from "../functions/formValidation";
import { useSelector, useDispatch } from "react-redux";
import { registerationSuccess, logoutSuccess } from "../redux/account/userAction";

import styles from "./accounts.module.css";
import axios from "axios";

const Register = () => {
  const success = useRef();
  const failed = useRef();
  const form = useRef();

  const navigate = useNavigate();

  const { userExist, isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [data, setData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [account, setAccount] = useState("");

  useEffect(() => {
    if (userExist && isLoggedIn) {
      navigate("/Dashboard", { replace: true });
    }
  }, [userExist, navigate, isLoggedIn]);

  useEffect(() => {
    setErrors(authentication(data, "REGISTER"));
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
      if (account) {
        const User = account.find((item) => item.email === data.email);
        if (User) {
          failed.current.textContent = "User with This Email already exist.";
          success.current.textContent = "";
        } else {
          axios
            .post(`${process.env.REACT_APP_BASE_API_URL}/accounts`, {
              id: data.email,
              fullName: data.fullName,
              email: data.email,
              password: data.password,
              emailVerified: false,
              address: "",
              phone: "",
              zipCode: "",
            })
            .then((response) => response.data);
          dispatch(registerationSuccess());
          failed.current.textContent = "";
          success.current.textContent = "Registration Successful. Please Check Your Email to Verify Your Email Address.";

          if (data.email) {
            const text = "Please Follow the Link to Verify Your Email Address:";
            const emailBody = `${text} ${process.env.REACT_APP_BASE_URL}/EmailVerification?email=${data.email}`;
            axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/send_mail`, {
              text: emailBody,
              to: data.email,
              subject: "Email Verification",
            });
          }

          dispatch(logoutSuccess());
        }
      }
    } else {
      setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form ref={form} onSubmit={submitHandler}>
          <h2 className={styles.accountsTitle}>Register</h2>
          <p className={styles.accountsHelp}>Please Fill the Form.</p>

          <div>
            <input className={styles.formControl} type="text" name="fullName" placeholder="Full Name" value={data.fullName} onChange={changeHandler} onFocus={focusHandler} />
            <p className={styles.errors}>{errors.fullName && touched.fullName && errors.fullName}</p>
          </div>
          <div>
            <input className={styles.formControl} type="email" name="email" placeholder="Email" value={data.email} onChange={changeHandler} onFocus={focusHandler} />
            <p className={styles.errors}>{errors.email && touched.email && errors.email}</p>
          </div>
          <div>
            <input className={styles.formControl} type="password" name="password" placeholder="Password" value={data.password} onChange={changeHandler} onFocus={focusHandler} />
            <p className={styles.errors}>{errors.password && touched.password && errors.password}</p>
          </div>
          <div>
            <input className={styles.formControl} type="password" name="confirmPassword" placeholder="Confirm Password" value={data.confirmPassword} onChange={changeHandler} onFocus={focusHandler} />
            <p className={styles.errors}>{errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}</p>
          </div>

          <button className={styles.btn} type="submit">
            Register
          </button>

          <div className={styles.result}>
            <span className={styles.failed} ref={failed}></span>
            <span className={styles.success} ref={success}></span>
          </div>

          <div className={styles.accountsTerms}>
            <span style={{ fontWeight: "normal", color: "#000" }}>By Creating an Account You Agree to Our </span>
            <Link className={styles.a} to="/Terms">
              Terms & Conditions
            </Link>
            <span style={{ fontWeight: "normal", color: "#000" }}>.</span>
          </div>

          <div className={styles.accounts}>
            <span style={{ fontWeight: "normal", color: "#000" }}>Already Have an Account? </span>
            <Link className={styles.a} to="/Login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
