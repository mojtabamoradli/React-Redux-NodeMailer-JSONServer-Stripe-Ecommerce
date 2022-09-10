const initialState = {
  error: null,
  isLoggedIn: null,
  userExist: null,
  account: null,
  adminExist: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "REGISTERATION_SUCCESS":
    case "LOGOUT_SUCCESS":
    case "FORGOT_PASSWORD_SUCCESS":
      return {
        ...state,
        isLoggedIn: null,
        userExist: action.payload,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoggedIn: action.payload,
        userExist: true,
      };
    case "REGISTERATION_FAILURE":
    case "LOGIN_FAILURE":
    case "FORGOT_PASSWORD_FAILURE":
    case "LOGOUT_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
