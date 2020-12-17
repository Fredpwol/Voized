import { CLEAR_SEARCH, GET_CONTACTS, LOGOUT_USER, SEARCH_USERS } from "../actions/constants";

const initialState = {contacts: [], search:[], contactsId:{}};


export default function userDataReducer(state = initialState, action) {
    switch (action.type){
        case GET_CONTACTS:
            let tempIds = {};
            action.payload.contacts.forEach((contact) => {
                tempIds[contact._id] = true;
            } )
            return {
                ...state,
                contacts : action.payload.contacts,
                contactsId: tempIds
            }
        case SEARCH_USERS:
            return {
                ...state,
                search : action.payload.search
            }
        case CLEAR_SEARCH:
            return {
                ...state,
                search: []
            }
        case  LOGOUT_USER:
            return initialState;
        default:
            return state;
    }

}