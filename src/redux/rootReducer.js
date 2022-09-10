import { combineReducers } from "redux";
import productsReducer from "./products/productsReducer";
import cartReducer from "./cart/cartReducer";
import userReducer from "./account/userReducer";

const rootReducer = combineReducers({
  productsState: productsReducer,
  cartState: cartReducer,
  user: userReducer,
});

export default rootReducer;
