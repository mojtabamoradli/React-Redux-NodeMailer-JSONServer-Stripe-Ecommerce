import { useDispatch } from "react-redux";

import trash from "../assets/img/trash.png";
import plus from "../assets/img/plus.png";
import minus from "../assets/img/minus.png";

import styles from "./Cart.module.css";

import { removeItem, decrease, increase } from "../redux/cart/cartAction";

const Cart = (props) => {
  const dispatch = useDispatch();
  const { album, title, price, quantity, off_percent } = props.data;

  return (
    <div className={styles.container}>
      <img className={styles.productImage} src={album[0].image} alt="" />

      <div className={styles.data}>
        <h3>{title}</h3>
        {off_percent ? (
          <>
            {" "}
            <span className={styles.off}>{`$${price}`}</span> | <span>{`${off_percent}% OFF`}</span> | <span>{`$${price - price * off_percent * 0.01}`}</span>
          </>
        ) : (
          <p>{`$${price}`}</p>
        )}
      </div>
      <div>
        <span className={styles.quantity}>{quantity}</span>
      </div>
      <div className={styles.buttonContainer}>
        {quantity > 1 ? (
          <button onClick={() => dispatch(decrease(props.data))}>
            <img src={minus} alt="minus" />
          </button>
        ) : (
          <button onClick={() => dispatch(removeItem(props.data))}>
            <img src={trash} alt="trash" />
          </button>
        )}

        <button onClick={() => dispatch(increase(props.data))}>
          <img src={plus} alt="plus" />
        </button>
      </div>
    </div>
  );
};

export default Cart;
