import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import trash from "../assets/img/trash.png";
import plus from "../assets/img/plus.png";
import minus from "../assets/img/minus.png";

import styles from "./Product.module.css";
import { addItem, removeItem, increase, decrease } from "../redux/cart/cartAction";
import ScrollToTop from "./ScrollToTop";

const Product = ({ product }) => {
  const state = useSelector((state) => state.cartState);
  const dispatch = useDispatch();

  const quantityCount = (state, id) => {
    const index = state.selectedItems.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    } else {
      return state.selectedItems[index].quantity;
    }
  };

  const isInCart = (state, id) => {
    const result = !!state.selectedItems.find((item) => item.id === id);
    return result;
  };
  return (
    <div className={styles.container}>
      <ScrollToTop />
      <img className={styles.cardImage} src={product.album[0].image} alt="product" />
      <h3>{product.title}</h3>

      {product.off_percent ? (
        <div className={styles.price}>
          {" "}
          <span className={styles.off}>{`$${product.price}`}</span> | <span> {`${product.off_percent}% OFF`}</span> | <span>{`$${product.price - product.price * product.off_percent * 0.01}`}</span>{" "}
        </div>
      ) : (
        <div>{`$${product.price}`}</div>
      )}

      <div className={styles.linkContainer}>
        <Link to={`/shop/${product.id}`}>Details</Link>
        <div className={styles.buttonContainer}>
          {quantityCount(state, product.id) === 1 && (
            <button className={styles.smallButton} onClick={() => dispatch(removeItem(product))}>
              <img width="18px" src={trash} alt="trash" />
            </button>
          )}
          {quantityCount(state, product.id) > 1 && (
            <button className={styles.smallButton} onClick={() => dispatch(decrease(product))}>
              <img width="18px" src={minus} alt="minus" />
            </button>
          )}
          {quantityCount(state, product.id) > 0 && <span className={styles.counter}>{quantityCount(state, product.id)}</span>}
          {isInCart(state, product.id) ? (
            <button className={styles.smallButton} onClick={() => dispatch(increase(product))}>
              <img width="18px" src={plus} alt="plus" />
            </button>
          ) : (
            <button onClick={() => dispatch(addItem(product))}>Add to Cart</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
