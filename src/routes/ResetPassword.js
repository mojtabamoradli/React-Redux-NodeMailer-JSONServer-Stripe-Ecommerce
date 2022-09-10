import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { authentication } from "../functions/formValidation";

import styles from "./accounts.module.css";
import axios from "axios";

const ResetPassword = () => {
  const success = useRef();
  const failed = useRef();

  const navigate = useNavigate();

  const [data, setData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [account, setAccount] = useState("");

  const useQuery = () => {
    const location = useLocation();
    return new URLSearchParams(location.search);
  };
  const query = useQuery();

  const UserEmail = query.get("email");
  useEffect(() => {
    if (UserEmail == null) {
      navigate("/Login", { replace: true });
    }
  }, [UserEmail, navigate]);

  useEffect(() => {
    setErrors(authentication(data, "RESET_PASSWORD"));
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
      const User = account.find((item) => item.email === UserEmail);
      axios
        .put(`${process.env.REACT_APP_BASE_API_URL}/accounts/${User.id}`, {
          id: User.id,
          fullName: User.fullName,
          email: User.email,
          password: data.password,
          emailVerified: User.emailVerified,
          address: User.address,
          phone: User.phone,
          zipCode: User.zipCode,
        })
        .then((response) => response.data);
      failed.current.textContent = "";
      success.current.textContent = "Password Updated! You Can Now Login With Your New Password.";
    } else {
      setTouched({ password: true, confirmPassword: true });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={submitHandler}>
          <h2 className={styles.accountsTitle}>Reset Password</h2>
          <p className={styles.accountsHelp}>Enter New Password.</p>

          <div>
            <input className={styles.formControl} type="password" name="password" placeholder="New Password" value={data.password} onChange={changeHandler} onFocus={focusHandler} />
            <p className={styles.errors}>{errors.password && touched.password && errors.password}</p>
          </div>
          <div>
            <input
              className={styles.formControl}
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={data.confirmPassword}
              onChange={changeHandler}
              onFocus={focusHandler}
            />
            <p className={styles.errors}>{errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}</p>
          </div>

          <button className={styles.btn} type="submit">
            Reset Password
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

export default ResetPassword;
