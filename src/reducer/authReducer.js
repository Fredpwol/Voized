/* eslint-disable import/no-anonymous-default-export */

const initialState = {token: null, username: null, password:null, email: null, isAuthenticated:false};

export default (state=initialState, action, ) => {
    switch (action.type) {
        case 'SET_TOKEN':
            break;
    
        default:
            return state;
    }
}