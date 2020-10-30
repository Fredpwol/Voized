/* eslint-disable import/no-anonymous-default-export */

import { LOGGING_IN, LOGIN_ERROR, LOGIN_USER, LOGOUT_USER } from "../actions/constants";

const initialState = {
  token: localStorage.getItem("token"),
  username: localStorage.getItem("username"),
  password: localStorage.getItem("password"),
  email: localStorage.getItem("email"),
  isAuthenticated: localStorage.getItem("isAuthenticated"),
  loginError:"",
  SignupError:"",
  loggingIn:false,
  userBgColor:localStorage.getItem("bgColor") 
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      localStorage.setItem("token", action.payload.token)
      localStorage.setItem("username", action.payload.username)
      localStorage.setItem("password", action.payload.password)
      localStorage.setItem("email", action.payload.email)
      localStorage.setItem("isAuthenticated", true)
      localStorage.setItem("bgColor", action.payload.userBgColor)
      return {
        ...state,
        username: action.payload.username,
        password: action.payload.password,
        email: action.payload.email,
        token: action.payload.token,
        userBgColor:action.payload.userBgColor,
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
    case LOGOUT_USER:
      localStorage.setItem("token", "")
      localStorage.setItem("username", "")
      localStorage.setItem("password", "")
      localStorage.setItem("email", "")
      localStorage.setItem("isAuthenticated", false)
      localStorage.setItem("bgColor","" )
      return {
        ...state,
        username: "",
        password: "",
        email: "",
        token: null,
        isAuthenticated:false
      }
    default:
      return state;
  }
};
