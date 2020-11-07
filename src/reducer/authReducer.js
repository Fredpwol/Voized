/* eslint-disable import/no-anonymous-default-export */

import { LOGGING_IN, LOGIN_ERROR, LOGIN_USER, LOGOUT_USER, NEW_PROFILE_IMAGE, SIGNUP_ERROR, SIGNUP_USER } from "../actions/constants";

const initialState = {
  id: localStorage.getItem("id"),
  token: localStorage.getItem("token"),
  username: localStorage.getItem("username"),
  password: localStorage.getItem("password"),
  email: localStorage.getItem("email"),
  isAuthenticated: localStorage.getItem("isAuthenticated"),
  loginError:"",
  signupError:"",
  loggingIn:false,
  userBgColor:localStorage.getItem("bgColor"),
  profileImage: localStorage.getItem("profileImage")
};

export default function (state = initialState, action){
  switch (action.type) {
    case LOGIN_USER:
      localStorage.setItem("token", action.payload.token)
      localStorage.setItem("username", action.payload.username)
      localStorage.setItem("password", action.payload.password)
      localStorage.setItem("email", action.payload.email)
      localStorage.setItem("isAuthenticated", true)
      localStorage.setItem("bgColor", action.payload.userBgColor)
      localStorage.setItem("id", action.payload.id)
      localStorage.setItem("profileImage", action.payload.profileImage)
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
        password: action.payload.password,
        email: action.payload.email,
        token: action.payload.token,
        userBgColor:action.payload.userBgColor,
        profileImage: action.payload.profileImage,
        isAuthenticated: true,
        loggingIn:false,
        loginError:""
      };
    
    case LOGIN_ERROR:
      return{
        ...state,
        loginError:action.payload.message,
        loggingIn:false
      }
    case SIGNUP_USER:
      localStorage.setItem("token", action.payload.token)
      localStorage.setItem("username", action.payload.username)
      localStorage.setItem("password", action.payload.password)
      localStorage.setItem("email", action.payload.email)
      localStorage.setItem("isAuthenticated", true)
      localStorage.setItem("bgColor", action.payload.userBgColor)
      localStorage.setItem("id", action.payload.id)
      localStorage.setItem('profileImage', action.payload.profileImage)
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
        password: action.payload.password,
        email: action.payload.email,
        token: action.payload.token,
        userBgColor:action.payload.userBgColor,
        profileImage: action.payload.profileImage,
        signupError:"",
        isAuthenticated: true,
        loggingIn:false
      };

    case SIGNUP_ERROR:
      return{
        ...state,
        signupError: action.payload.message,
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
      localStorage.removeItem("isAuthenticated")
      localStorage.setItem("bgColor","" )
      return {
        ...state,
        username: "",
        password: "",
        email: "",
        token: null,
        isAuthenticated:false,
      }
    case NEW_PROFILE_IMAGE:
      localStorage.setItem("profileImage", action.payload.path);
      return {
        ...state,
        profileImage : action.payload.path
      }
    default:
      return state;
  }
};
