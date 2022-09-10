import { Route, Routes, Navigate } from "react-router-dom";
import Shop from "./components/Shop";
import ProductDetails from "./components/ProductDetails";
import ShopCart from "./components/ShopCart";
import Home from "./pages/Home";

import Login from "./routes/Login";
import Register from "./routes/Register";
import ForgotPassword from "./routes/ForgotPassword";
import ResetPassword from "./routes/ResetPassword";
import Dashboard from "./routes/Dashboard";
import EmailVerification from "./routes/EmailVerification";
import Admin from "./admin/Admin";
import Terms from "./pages/Terms";

import { useSelector } from "react-redux";
import NotFound from "./pages/NotFound";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Header from "./components/layout/Header";

function App() {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/admin" element={<Admin />} />

        <Route exact path="/shop/:id" element={<ProductDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route
          path="/cart"
          element={
            <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)}>
              <ShopCart />
            </Elements>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<NotFound to="/" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/EmailVerification" element={<EmailVerification />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/Terms" element={<Terms />} />

        <Route path="/Dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
