import React from "react";

import styles from "./Home.module.css";
import RRNJS from "../assets/img/RRNJS.svg";
import Routes from "../assets/img/Routes.svg";

export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.h1}>
          <span className={styles.react}>React</span>, <span className={styles.redux}>Redux</span>, <span className={styles.nodeMailer}>Node Mailer</span>,{" "}
          <span className={styles.jsonServer}>JSON-Server</span>, <span className={styles.stripe}>Stripe</span>
        </h1>
        <h2 style={{ marginTop: "10px", color: "#000", marginBottom: "0" }}>An Ecommerce Website With REST API Backend</h2>
        <img className={styles.image} title="RRNJS" alt="RRNJS" src={RRNJS} />

        <div className={styles.featuresContainer1}>
          <div>
            <p>+ NodeJS for Eamiling & Payment</p>
            <p>+ Admin Panel</p>
            <p>+ Dashboard Panel</p>
            <p>+ Adding Deleting Comments</p>
            <p>+ Approving & Deleting Comments by Admin</p>
            <p>+ Search Products</p>
          </div>

          <div className={styles.featuresContainer2}>
            <div>
              <p>+ Go through Similar Products</p>
              <p>+ Stripe Payment Method</p>
              <p>+ Order Emails (Status & Receipt)</p>
              <p>+ Adding & Deleting Product in Admin Panel</p>
              <p>+ Updating Service Cost (Tax, Shipping)</p>
              <p>+ Setting Coupon Code in Admin Panel</p>
            </div>
          </div>
        </div>
        <img className={styles.routes} title="Routes" alt="Routes" src={Routes} />
      </div>
    </>
  );
}
