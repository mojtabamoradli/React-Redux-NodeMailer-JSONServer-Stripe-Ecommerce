import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { logoutSuccess } from "../redux/account/userAction";

import styles from "./accounts.module.css";

const EmailVerification = () => {
  const success = useRef();
  const failed = useRef();

  const navigate = useNavigate();

  const dispatch = useDispatch();
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
  }, [UserEmail, navigate, query]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/accounts`).then((response) => {
      setAccount(response.data);
    });
  }, []);

  useEffect(() => {
    if (account) {
      const User = account.find((item) => item.email === UserEmail);
      if (!User.emailVerified) {
        axios
          .put(`${process.env.REACT_APP_BASE_API_URL}/accounts/${User.id}`, {
            id: User.id,
            fullName: User.fullName,
            email: User.email,
            password: User.password,
            emailVerified: true,
            address: "",
            phone: "",
            zipCode: "",
          })
          .then((response) => response.data);
        success.current.textContent = "Your Email Address Has Been Verified. You Can Now Login To Your Account.";
        failed.current.textContent = "";
        dispatch(logoutSuccess());
      } else if (User.emailVerified) {
        success.current.textContent = "Your Email Address Has Been Verified.";
        failed.current.textContent = "";
      } else {
        success.current.textContent = "";
        failed.current.textContent = `Your Email Address Is Not Verified. Please Contanct: contact@mojtabamoradli.ir`;
      }
    }
  }, [account, UserEmail, dispatch]);

  return (
    <>
      <div className={styles.emailVerification}>
        <h1 className={styles.failed} ref={failed}>
          {" "}
        </h1>
        <h1 className={styles.success} ref={success}>
          {" "}
        </h1>
      </div>
    </>
  );
};

export default EmailVerification;
