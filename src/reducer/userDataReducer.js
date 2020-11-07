import { GET_CONTACTS, SEARCH_USERS } from "../actions/constants";

const initialState = {contacts: [], search:[], contactsId:{}};


export default function userDataReducer(state = initialState, action) {
    switch (action.type){
        case GET_CONTACTS:
            let tempIds = {};
            action.payload.contacts.forEach((contact) => {
                tempIds[contact.id] = true;
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
        default:
            return state;
    }

}