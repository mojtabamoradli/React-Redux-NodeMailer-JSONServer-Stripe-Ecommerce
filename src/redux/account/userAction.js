const registerationSuccess = () => {
  return {
    type: "REGISTERATION_SUCCESS",
  };
};
const registerationFailure = (error) => {
  return {
    type: "REGISTERATION_FAILURE",
    payload: error,
  };
};
const loginSuccess = (user) => {
  return {
    type: "LOGIN_SUCCESS",
    payload: user,
  };
};
const loginFailure = (error) => {
  return {
    type: "LOGIN_FAILURE",
    payload: error,
  };
};
const logoutSuccess = () => {
  return {
    type: "LOGOUT_SUCCESS",
  };
};
const forgotPasswordSuccess = () => {
  return {
    type: "FORGOT_PASSWORD_SUCCESS",
  };
};
const forgotPasswordFailure = (error) => {
  return {
    type: "FORGOT_PASSWORD_FAILURE",
    payload: error,
  };
};

export { registerationSuccess, registerationFailure, loginSuccess, loginFailure, forgotPasswordSuccess, forgotPasswordFailure, logoutSuccess };
