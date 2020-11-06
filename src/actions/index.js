import { LOGIN_ERROR, LOGIN_USER, LOGGING_IN, LOGOUT_USER, SIGNUP_USER, SIGNUP_ERROR, NEW_REGISTER, NEW_PROFILE_IMAGE } from "./constants";

export const loginUser = ({ username, password }) => {
  return (disbatch) => {
    disbatch({ type: LOGGING_IN });
    fetch("/user/login", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      cache:"force-cache",
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          disbatch({
            payload: {
              username: data.user.username,
              email: data.user.email,
              token: data.token,
              userBgColor: data.user.bg_color,
              id: data.user.id,
              profileImage: data.user.profile_pic
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
              username: data.user.username,
              email: data.user.email,
              token: data.token,
              userBgColor: data.user.bg_color,
              id: data.user.id,
              profileImage: data.user.profile_pic
            },
            type: SIGNUP_USER,
          });
          disbatch({ type: NEW_REGISTER})
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

export const uploadImage = (form, id, token, callback) => {
  return (disbatch) => {
    fetch(`/user/${id}/profile-pic/upload`, {
      method: "POST",
      headers: new Headers({
        "Authorization": "Basic " + btoa(`${token}:no-password`)
      }),
      body: form
    })
    .then(res => res.json())
    .then(data => {
      if(data.status === "success"){
        disbatch({type: NEW_PROFILE_IMAGE, payload: data})
      }
      if (callback) callback(data)
    })
    .catch(error => {
      callback({status:"error", message:error.message})
    })
  }
}

export const toggleNewRegister = () => (
  {
    type: NEW_REGISTER
  }
)