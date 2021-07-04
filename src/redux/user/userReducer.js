import {
    CLEAR_ERROR,
    
    LOGIN_SUCCESS,
    LOGIN_REQUEST,
    LOGIN_FAILURE,
    
    LOGIN_LOGOUT,

    CONFIRMATION_CODE_REQUEST,
    CONFIRMATION_CODE_SUCCESS,
    CONFIRMATION_CODE_FAILURE,

    SET_PASSWORD_REQUEST,
    SET_PASSWORD_FAILURE,
    SET_PASSWORD_SUCCESS,

    GETTING_KEY_CHANGE_PASSWORD_REQUEST,
    GETTING_KEY_CHANGE_PASSWORD_SUCCESS,
    GETTING_KEY_CHANGE_PASSWORD_FAILURE,

    OPEN_GET_CODE

} from '../types'


const initialState = {

    isLoggedIn: localStorage.getItem('accessToken') ? true : false,
    userID: '',

    
    requestKey: '',
    confirmationСodeSent: false,
    
    passwordRequest: false,
    confirmationСodeRequested: false,
    loggingIn: false,
    keyСhangePasswordRequested: false,

    err: '',
    errPassword: '',
    errorConfirmationCode : '',


};

export default (state = initialState, action) => {


    switch (action.type) {


        case OPEN_GET_CODE:{
            return {
                ...state,
                errorConfirmationCode: '',
                confirmationСodeSent: false,
                errPassword: '',
                requestKey:''
            };

        }

        case GETTING_KEY_CHANGE_PASSWORD_REQUEST:
            return {
                ...state,
                keyСhangePasswordRequested: true,
                errorConfirmationCode: ''
            };

        case GETTING_KEY_CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                keyСhangePasswordRequested: false,
                errorConfirmationCode: ''
            };

        case GETTING_KEY_CHANGE_PASSWORD_FAILURE:
            return {
                ...state,
                keyСhangePasswordRequested: false,
                errorConfirmationCode: action.payload,
            };



        case SET_PASSWORD_REQUEST:
            return {
                ...state,
                passwordRequest: true,
                errPassword: ''
            };

        case SET_PASSWORD_SUCCESS:
            return {
                ...state,
                passwordRequest: false,
                errPassword: '',

                loggingIn: false,
                isLoggedIn: true,
            };

        case SET_PASSWORD_FAILURE:
            return {
                ...state,
                passwordRequest: false,
                errPassword: action.payload,
            };

        case CLEAR_ERROR:
            return {
                ...state,
                err: ''
            };

      

        case CONFIRMATION_CODE_SUCCESS:
            return {
                ...state,
                confirmationСodeRequested: false,
                errorConfirmationCode: '',
                confirmationСodeSent: true,
                requestKey: action.payload

            };


        case CONFIRMATION_CODE_FAILURE:
            return {
                ...state,
                confirmationСodeRequested: false,
                errorConfirmationCode: action.payload
            };


        case CONFIRMATION_CODE_REQUEST:
            return {
                ...state,
                ...action.payload,
                confirmationСodeRequested: true,
                loggingIn: false,
                isLoggedIn: false,
                errorConfirmationCode: '',
                err: '',
                confirmationСodeSent: false
            };

        case LOGIN_REQUEST:
            return {
                ...state,
                loggingIn: true,
                isLoggedIn: false,
                err: ''

            };


        case LOGIN_SUCCESS:
            return {
                ...state,
                ...action.payload,
                loggingIn: false,
                isLoggedIn: true,
                confirmationСodeSent: false,
                requestKey: ''
            };

        case LOGIN_FAILURE:
            return {
                ...state,

                err: action.payload,

                loggingIn: false,
                isLoggedIn: false,
            };


        case LOGIN_LOGOUT:
            return {
                ...state,
                ...action.payload,
                loggingIn: false,
                isLoggedIn: false,
            };


        default:

            return state
    }
}