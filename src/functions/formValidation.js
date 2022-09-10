const authentication = (data, type) => {
  const errors = {};

  if (type === "REGISTER") {
    if (!data.fullName.trim()) {
      errors.fullName = "Please Enter Your Full Name.";
    } else {
      delete errors.fullName;
    }

    if (!data.email) {
      errors.email = "Please Enter Your Email Address.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Please Enter a Valid Email Address.";
    } else {
      delete errors.email;
    }

    if (!data.password) {
      errors.password = "Please Choose a Password.";
    } else if (data.password.length < 6) {
      errors.password = "Chosen Password needs to Be at Least 6 Character.";
    } else {
      delete errors.password;
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = "Please Confirm Your Password.";
    } else if (data.confirmPassword !== data.password) {
      errors.confirmPassword = "Passwords Do Not Match.";
    } else {
      delete errors.confirmPassword;
    }
  }

  if (type === "LOGIN") {
    if (!data.email) {
      errors.email = "Please Enter Your Email Address.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Please Enter a Valid Email Address.";
    } else {
      delete errors.email;
    }

    if (!data.password) {
      errors.password = "Please Enter Your Password.";
    } else if (data.password.length < 6) {
      errors.password = "Your Password is at Least 6 Character.";
    } else {
      delete errors.password;
    }
  }

  if (type === "FORGOT_PASSWORD") {
    if (!data.email) {
      errors.email = "Please Enter Your Email Address.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Please Enter a Valid Email Address.";
    } else {
      delete errors.email;
    }
  }

  if (type === "RESET_PASSWORD") {
    if (!data.password) {
      errors.password = "Please Choose a New Password.";
    } else if (data.password.length < 6) {
      errors.password = "Chosen Password needs to Be at Least 6 Character.";
    } else {
      delete errors.password;
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = "Please Confirm Your New Password.";
    } else if (data.confirmPassword !== data.password) {
      errors.confirmPassword = "Passwords Do Not Match.";
    } else {
      delete errors.confirmPassword;
    }
  }

  return errors;
};

export { authentication };
