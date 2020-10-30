/* eslint-disable import/no-anonymous-default-export */

import { LOGGING_IN, LOGIN_ERROR, LOGIN_USER } from "../actions/constants";

const initialState = {
  token: localStorage.getItem("token"),
  username: localStorage.getItem("username"),
  password: localStorage.getItem("password"),
  email: localStorage.getItem("email"),
  isAuthenticated: localStorage.getItem("isAuthenticated"),
  loginError:"",
  SignupError:"",
  loggingIn:false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      localStorage.setItem("token", action.payload.token)
      localStorage.setItem("username", action.payload.username)
      localStorage.setItem("password", action.payload.password)
      localStorage.setItem("email", action.payload.email)
      localStorage.setItem("isAuthenticated", true)
      return {
        ...state,
        username: action.payload.username,
        password: action.payload.password,
        email: action.payload.email,
        token: action.payload.token,
        isAuthenticated: true,
        loggingIn:false
      };
    
    case LOGIN_ERROR:
      return{
        ...state,
        loginError:action.payload.message,
        loggingIn:false
      }
    case LOGGING_IN:
      return{
        ...state,
        loggingIn:true
      }
    default:
      return state;
  }
};
