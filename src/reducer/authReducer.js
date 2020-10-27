/* eslint-disable import/no-anonymous-default-export */

import { LOGIN_USER } from "../actions/constants";

const initialState = {
  token: null,
  username: null,
  password: null,
  email: null,
  isAuthenticated: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        username: action.payload.username,
        password: action.payload.password,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};
