import { API_URL, username, password } from '../Constants'
import { logOut } from '../redux/user/userActions'
import axios from 'axios'

export const getAccessToken = () => {
    return localStorage.getItem('accessToken')
}

export const setAccessToken = (accessToken) => {
    console.log('accessToken', accessToken);
    localStorage.setItem('accessToken', accessToken);
}

export const login = (email, password) => {
    return axios.post(`${API_URL}/?typerequest=login`, { email, password });
}

export const getConformationCodeApi = (userID) => {
    return axios.post(`${API_URL}/?typerequest=getConformationCode`, { userID });
}

export const getKeyChangeApi = (userID, requestKey, code) => {
    return axios.post(`${API_URL}/?typerequest=getKeyChangePassword`, { userID, requestKey, code });
}

export const passwordChange = (passwordСhangeKey, password) => {
    return axios.post(`${API_URL}/?typerequest=passwordChange`, { passwordСhangeKey, password });
}

export const testPrivateRequest = () => {
    return axios.post(`${API_URL}/?typerequest=testPrivateRequest`, { test: 'test' });
}

const refreshToken = () => {
    return axios.post(`${API_URL}/?typerequest=refreshToken`, {});
}

export const executorRequests = (functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatch, repeat=false) => {


    axios.defaults.headers.common = {
        'authorization': `bearer ${getAccessToken()}`,
        'fcm': localStorage.getItem('messageRecipientKey')
    }

    functionRequest()
        .then(response => responseHandlingFunction(response.data))
        .catch((error) => {

            console.log('error', { error });

            if (!error.response && !error.request) {
                exceptionHandlingFunction("что то полшло не так..." + error.message);
            } else if (!error.response && error.request) {
                exceptionHandlingFunction("Проблема соединения")
            } else if (error.request.status == 401) {


                if (repeat) {
                    dispatch(logOut())
                }
                else {
                    refreshToken()
                    .then(response => {
                        setAccessToken(response.data.accessToken)
                        return executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatch, true);
                    })
                    .catch((error) => {dispatch(logOut())})
                }
           
            } else {
                exceptionHandlingFunction(error.response.data)
            }

        })
}

