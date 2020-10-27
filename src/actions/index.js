import { LOGIN_USER } from "./constants"

export const loginUser =  ({username, password}) => (
    {
        type:LOGIN_USER,
        payload:{username, password}
    }
)