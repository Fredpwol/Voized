import { LOGIN_ERROR, LOGIN_USER, LOGGING_IN, LOGOUT_USER, SIGNUP_USER, SIGNUP_ERROR, NEW_REGISTER, NEW_PROFILE_IMAGE, GET_CONTACTS, SEARCH_USERS, CLEAR_SEARCH, SET_CALLS } from "./constants";
import { API_ENDPOINT } from "../utils";


export const ok = "success";

export const loginUser = ({ username, password }) => {
  return (disbatch) => {
    disbatch({ type: LOGGING_IN });
    fetch(`${API_ENDPOINT}/user/login`, {
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
        if (data.status === ok) {
          disbatch({
            payload: {
              username: data.user.username,
              email: data.user.email,
              token: data.token,
              userBgColor: data.user.bg_color,
              id: data.user._id,
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
    fetch(`${API_ENDPOINT}/user/register`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({ username, password, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === ok) {
          disbatch({
            payload: {
              username: data.user.username,
              email: data.user.email,
              token: data.token,
              userBgColor: data.user.bg_color,
              id: data.user._id,
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
    fetch(`${API_ENDPOINT}/user/${id}/profile-pic/upload`, {
      method: "POST",
      headers: new Headers({
        "Authorization": "Basic " + btoa(`${token}:no-password`)
      }),
      body: form
    })
    .then(res => res.json())
    .then(data => {
      if(data.status === ok){
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

export const getContacts = ( id, token ) => {
  return (disbatch) => {
    fetch(`${API_ENDPOINT}/user/${id}/contacts`, 
    {
      headers: new Headers({
        "Authorization" : "Basic " + btoa(`${token}:no-password`)
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === ok){
        disbatch({type: GET_CONTACTS, payload: { contacts: data.contacts}})
      }
    })
  }
}

export const searchUsers = (username, token) => {
  return (disbatch) => {
    if (username !== ""){
      fetch(`${API_ENDPOINT}/user/search?q=${username}`, {
        headers: new Headers({
          "Authorization" : "Basic " + btoa(`${token}:no-password`)
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === ok){
          disbatch({ type: SEARCH_USERS, payload: {search: data.users}})
        }
      })
    }
    else{
      disbatch({ type: CLEAR_SEARCH})
    }
  }
}

export const addContact = (id, token) => {
  return (disbatch) => {
    fetch(`${API_ENDPOINT}/user/contacts/new?id=${id}`, {
      headers: new Headers({
        "Authorization" : "Basic " + btoa(`${token}:no-password`)
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.status === ok){
        disbatch({ type: GET_CONTACTS, payload: {contacts: data.contacts}})
      }
    })
  }
}

export const fetchCalls = (id, token) => {
  return (disbatch) => {
    fetch(`${API_ENDPOINT}/user/${id}/calls`, {
      headers: new Headers({
        "Authorization" : "Basic " + btoa(`${token}:no-password`)
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === ok){
        disbatch({ type: SET_CALLS, payload: data.calls })
      }
    })
  }
}