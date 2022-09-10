import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";

import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/products/productsAction";
import Product from "./Product";
import axios from "axios";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState("");
  const [mineComment, setMineComment] = useState("");

  const id = params.id;

  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.productsState);
  const { isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    if (!productsState.products.length) dispatch(fetchProducts());
    // setProduct(productsState.products)
  }, [dispatch, productsState.products.length]);

  // const nameHandler = (event) => {
  //   setName(event.target.value);
  // };
  const commentHandler = (event) => {
    setComment(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (comment) {
      axios
        .post(`${process.env.REACT_APP_BASE_API_URL}/comments`, { name: isLoggedIn.fullName, comment, forId: params.id, forTitle: productsState.products[id - 1].title, approved: false })
        .then((response) => response.data);
      alert("Comment Added, Waiting For Approval.");
    } else {
      alert("please fill the form");
    }
  };

  const getComments = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/comments`);
    return response.data;
  };

  useEffect(() => {
    const fetchAPI = async () => {
      const comments = await getComments();
      const postComments = comments.filter(function (com) {
        return com.forId === id;
      });
      setPostComments(postComments);
    };
    fetchAPI();
  }, [id]);

  const commentDeleteHandler = () => {
    axios.delete(`${process.env.REACT_APP_BASE_API_URL}/comments/${mineComment}`);
    // alert("Comment Deleted.");
  };

  return (
    <>
      {productsState.products[id - 1] && (
        <div className={styles.container}>
          <img className={styles.image} src={productsState.products[id - 1].album[0].image} alt="product" />

          <div>
            {productsState.products[id - 1].album.slice(1).map((item, index) => (
              <img className={styles.images} key={index} width={100} src={item.image} alt="product" />
            ))}
          </div>

          <div className={styles.textContainer}>
            <h3>{productsState.products[id - 1].title}</h3>
            <p className={styles.description}>{productsState.products[id - 1].description}</p>
            <p className={styles.category}>
              <span>Category:</span> {productsState.products[id - 1].category}
            </p>
            <p className={styles.rate}>
              <span>⭐️</span> {productsState.products[id - 1].rate}
            </p>
            <p style={{ marginBottom: "20px" }}>{productsState.products[id - 1].count ? `${productsState.products[id - 1].count} In stock` : "Out of Stock"}</p>

            <div className={styles.buttonContainer}>
              {productsState.products[id - 1].count && (
                <span className={styles.price}>
                  {productsState.products[id - 1].off_percent ? (
                    <p>
                      {`$${productsState.products[id - 1].price}`} | {`${productsState.products[id - 1].off_percent}% OFF`} |{" "}
                      {`$${productsState.products[id - 1].price - productsState.products[id - 1].price * productsState.products[id - 1].off_percent * 0.01}`}
                    </p>
                  ) : (
                    <p>{`${productsState.products[id - 1].price} $`}</p>
                  )}
                </span>
              )}

              <Link to="/shop">Back to Shop</Link>
            </div>
          </div>
        </div>
      )}

      <div className={styles.commentContainer}>
        <div className={styles.similarContainerH3}>
          <h3>Customer Comments and Reviews</h3>
        </div>

        {!isLoggedIn ? (
          <p>Login to Add Your Comment.</p>
        ) : (
          <form onSubmit={submitHandler}>
            <textarea className={styles.input} tyle="text" placeholder=" Comment..." value={comment} onChange={commentHandler} />
            <button>Add Comment</button>
          </form>
        )}
        {postComments &&
          postComments.map(
            (item, index) =>
              item.approved && (
                <p key={index} className={styles.comment}>
                  <span>{item.name}</span>: {item.comment}{" "}
                  {isLoggedIn && item.name === isLoggedIn.fullName && (
                    <>
                      <span>(MINE)</span>
                      <button
                        onClick={() => {
                          setMineComment(item.id);
                          commentDeleteHandler();
                        }}
                      >
                        Double Click to Delete
                      </button>
                    </>
                  )}
                </p>
              )
          )}
      </div>

      <div className={styles.similarContainerH3}>
        <h3>Similar Products</h3>
      </div>

      <div className={styles.similarContainer}>
        {productsState.products[id - 1]
          ? productsState.products.filter((product) => product.category.includes(productsState.products[id - 1].category)).map((product) => <Product key={product.id} product={product} />)
          : navigate("/shop")}
      </div>
    </>
  );
};

export default ProductDetails;
