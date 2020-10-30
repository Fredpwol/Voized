import { LOGIN_ERROR, LOGIN_USER, LOGGING_IN, LOGOUT_USER, SIGNUP_USER, SIGNUP_ERROR } from "./constants";

export const loginUser = ({ username, password }) => {
  return (disbatch) => {
    disbatch({ type: LOGGING_IN });
    fetch("/user/login", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          disbatch({
            payload: {
              username: data.username,
              email: data.email,
              token: data.token,
              userBgColor: data.bg_color
            },
            type: LOGIN_USER,
          });
        } else {
          disbatch({ type: LOGIN_ERROR, payload: { message: data.message } });
        }
      });
  };
};


export const signupUser = ({ username, password, email }) => {
  return (disbatch) => {
    disbatch({ type: LOGGING_IN });
    fetch("/user/register", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({ username, password, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          disbatch({
            payload: {
              username: data.username,
              email: data.email,
              token: data.token,
              userBgColor: data.bg_color
            },
            type: SIGNUP_USER,
          });
        } else {
          disbatch({ type: SIGNUP_ERROR, payload: { message: data.message } });
        }
      });
  };
};


export const logoutUser = () => {
  return(
    {
      type:LOGOUT_USER
    }
  )
}
