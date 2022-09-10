import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Product from "./Product";

import { fetchProducts } from "../redux/products/productsAction";

import styles from "./Shop.module.css";

const Shop = () => {
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.productsState);

  useEffect(() => {
    if (!productsState.products.length) dispatch(fetchProducts());
  }, [dispatch, productsState.products.length]);

  const [categoryOne, setCategoryOne] = useState(false);
  const [categoryTwo, setCategoryTwo] = useState(false);
  const [stock, setStock] = useState(false);
  const [off, setOff] = useState(false);

  return (
    <>
      <div className={styles.checkbox}>
        <input type="checkbox" value={categoryOne} onChange={() => setCategoryOne(!categoryOne)} />
        <span>Category One</span>
        <input type="checkbox" value={categoryTwo} onChange={() => setCategoryTwo(!categoryTwo)} />
        <span>Category Two</span>
        <input type="checkbox" value={stock} onChange={() => setStock(!stock)} />
        <span>In Stock</span>
        <input className={styles.input} type="checkbox" value={off} onChange={() => setOff(!off)} />
        <span>Off Products</span>
      </div>

      {categoryOne && <h2>Category One Products</h2>}
      <div className={styles.container}>
        {categoryOne && productsState.products.filter((product) => product.category === "men's clothing").map((product) => <Product key={product.id} product={product} />)}
      </div>

      {categoryTwo && <h2>Category Two Products</h2>}
      <div className={styles.container}>
        {categoryTwo && productsState.products.filter((product) => product.category === "wemon's clothing").map((product) => <Product key={product.id} product={product} />)}
      </div>

      {stock && <h2>In Stock Products</h2>}
      <div className={styles.container}>{stock && productsState.products.filter((product) => product.count !== 0).map((product) => <Product key={product.id} product={product} />)}</div>

      {off && <h2>Off Products</h2>}
      <div className={styles.container}>{off && productsState.products.filter((product) => product.off_percent !== 0).map((product) => <Product key={product.id} product={product} />)}</div>

      {!categoryOne && !categoryTwo && <h2>All Products</h2>}
      <div className={styles.container}>{!categoryOne && !categoryTwo && productsState.products.map((product) => <Product key={product.id} product={product} />)}</div>
    </>
  );
};

export default Shop;
