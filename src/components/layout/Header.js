import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";

import cart from "../../assets/img/cart.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logoutSuccess } from "../../redux/account/userAction";

const Header = () => {
  const dispatch = useDispatch();

  const state = useSelector((state) => state.cartState);
  const { isLoggedIn } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const getProduct = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/products`);
    return response.data;
  };

  useEffect(() => {
    const fetchAPI = async () => {
      const data = await getProduct();
      setProducts(data);
    };
    fetchAPI();
  }, []);

  const searchedProducts = products.filter((product) => product.title.toLowerCase().includes(search.toLowerCase()));

  const HEADER = styled.header`
    background-color: #fff;
    margin: 0 0 100px;
    position: fixed;
    top: 0;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    height: 70px;
  `;

  const Logo = styled.div`
    position: fixed;
    right: 30px;
    top: 24px;
    color: #1a73e8;
    font-size: 1rem;
    font-weight: bold;
    z-index: 1;

    @media (max-width: 935px) {
      position: relative;
      right: 0;
      text-align: center;
      z-index: 0;
    }
  `;

  const CartIcon = styled.div`
    position: fixed;
    z-index: 110;
    left: 30px;
    top: 15px;

    span {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #1a73e8;
      border-radius: 40%;
      width: 18px;
      height: 18px;
      line-height: 18px;
      font-size: 0.75rem;
      text-align: center;
      font-weight: bold;
      color: #fff;
    }
  `;

  const Hambergur = styled.div`
    @media (max-width: 935px) {
      position: fixed;
      cursor: pointer;
      z-index: 110;
      right: 30px;
      top: 21px;
    }

    div {
      display: flex;
      flex-direction: column;
      width: 2rem;
      height: 0.25rem;
      background: ${(props) => (props.open ? "#1a73e8" : "#1a73e8")};
      border-radius: 10px;
      transform-origin: 1px;
      transition: all 0.3s linear;
      &:nth-child(1) {
        transform: ${(props) => (props.open ? "rotate(45deg)" : "rotate(0)")};
      }
      &:nth-child(2) {
        opacity: ${(props) => (props.open ? 0 : 1)};
        margin-top: 6.4px;
      }
      &:nth-child(3) {
        transform: ${(props) => (props.open ? "rotate(-45deg)" : "rotate(0)")};
        margin-top: 6.4px;
      }
    }
  `;

  const Navigation = styled.div`
    background-color: #fff;
    margin: 0 0 100px;
    position: fixed;
    top: 0;
    width: 100%;
    @media (max-width: 935px) {
      transform: ${(props) => (props.open ? "translateX(0)" : "translateX(100%)")};
    }
  `;

  const SearchInput = styled.input`
    width: 400px;
    padding: 5px;
    height: 20px;
    border-radius: 10px;
    border: solid 4px #1a73e8;
    position: fixed;
    z-index: 100;
    left: 100px;
    top: 15px;

    ::placeholder {
      color: #1a73e8;
      opacity: 0.9;
      font-size: 0.9rem;
    }

    :focus {
      border: solid 4px #1a73e8;
    }

    @media (max-width: 935px) {
      display: none;
    }
  `;

  const Search = styled.div`
    display: block;
    position: fixed;
    left: 105px;
    top: 80px;
    transition: all 0.25s ease-in 0s;
    z-index: 111;
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    width: 400px;

    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      margin-bottom: 5px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      justify-content: left;
    }

    img {
      border-radius: 6px;
      margin-right: 10px;
    }
  `;

  const Ul = styled.ul`
    z-index: 100;
    list-style: none;
    display: flex;
    margin: 25px 545px;

    li {
      white-space: nowrap;
      list-style-type: none;
      text-decoration: none;
      color: #fff;
      font-size: 1rem;
      font-weight: bold;
      margin-right: 10px;
    }

    @media (max-width: 935px) {
      position: fixed;
      margin-top: 0;
      background: #fff;
      z-index: 99;
      top: 0;
      right: -250px;
      height: 1000vh;
      width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: ${(props) => (props.open ? "translateX(0)" : "translateX(100%)")};
      display: flex;
      flex-flow: wrap column;

      li {
        position: relative;
        top: 120px;
        margin-top: 20px;
        margin-left: 30px;
      }
    }
  `;

  const But = styled.button`
    background-color: #b33b3b;
    color: #fff;
    border: #1a73e8;
    padding: 5px;
    font-weight: bold;
    font-size: 1rem;
    border-radius: 10px;
    margin-top: -10px;
  `;

  return (
    <>
      <HEADER>
        <CartIcon>
          <Link to="/cart">
            <img width="45px" src={cart} alt="" />
          </Link>
          <span>{state.itemsCounter}</span>
        </CartIcon>

        <SearchInput autoFocus="autoFocus" placeholder=" Search..." value={search} onChange={(event) => setSearch(event.target.value)} />

        <Hambergur open={open} onClick={() => setOpen(!open)}>
          <div></div>
          <div></div>
          <div></div>
        </Hambergur>

        <Logo>
          <Link to="/">LOGO</Link>
        </Logo>

        <Navigation open={open} onBlur={() => setOpen(!open)}>
          <Ul>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            {!isLoggedIn && (
              <li>
                <Link to="/login">Account</Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link to="/dashboard">{isLoggedIn.fullName}</Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <But onClick={() => dispatch(logoutSuccess())}>Logout</But>
              </li>
            )}
          </Ul>

          {search && (
            <Search>
              {searchedProducts.map((product) => (
                <Link onBlur={() => setSearch("")} key={product.id} to={`/shop/${product.id}`}>
                  <div>
                    <img width="40px" src={product.album[0].image} alt="" />
                    <p>{product.title}</p>
                  </div>
                </Link>
              ))}
            </Search>
          )}
        </Navigation>
      </HEADER>
    </>
  );
};

export default Header;
