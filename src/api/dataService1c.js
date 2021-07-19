import { API_URL, username, password } from '../Constants'
import { logOut } from '../redux/user/userActions'
import axios from 'axios'


export const getFileTask = (id, uidTask, uidFile) => {
 
    return axios.post(`${API_URL}/?typerequest=getFileTask&id=${id}&uidTask=${uidTask}&uidFile=${uidFile}`,  {});
}

export const getImgMaket = (id, fileName) => {
  
    return axios.post(`${API_URL}/?typerequest=getImgMaket&id=${id}&fileName=${fileName}`, {});
}

export const getListReports = (id) => {
    return axios.post(`${API_URL}/?typerequest=getListReports`,  {});
}


export const nextStepProject = (idProject, currentStage, objectImage, progress, objectsRecipients, isSave) => {



    console.log('objectImage', objectImage);

    let objectImageR;
    if (!isSave && objectImage.hasOwnProperty('files') && objectImage.files ) {
        objectImageR = { ...objectImage, files: objectImage.files.map(file => file.uid) };
    }
    else {
        objectImageR = objectImage;
    }
    return axios.post(`${API_URL}/?typerequest=nextStepProject`,  { idProject, currentStage, objectImage: objectImageR, progress, objectsRecipients });

}


export const removeTask = (id, uid) => {
    return axios.post(`${API_URL}/?typerequest=removeTask&id=${id}`,  { uid });
}


export const getProjectsMakets = () => {
    return axios.post(`${API_URL}/?typerequest=getProjectsMakets`,  {});
}

export const getReportHTML = (id) => {
    return axios.post(`${API_URL}/?typerequest=getReportHTML`,  {id});
}

export const saveFileСonfirmation = (id, fileName, shortfileName, fileBase64) => {
    return axios.post(`${API_URL}/?typerequest=saveFileСonfirmation&id=${id}&fileName=${fileName}&shortfileName=${shortfileName}`,  { fileBase64: fileBase64 });
}

export const setMaketStatus = (id, uidState) => {
    
    return axios.post(`${API_URL}/?typerequest=setMaketStatus&id=${id}`,  { uidState });
}

export const saveTask = (id, uid, number, taskText, taskFiles) => {
    return axios.post(`${API_URL}/?typerequest=saveTask&id=${id}`,  { taskText, uid, number, taskFiles });
}


export const getProjectApi = (id, maketId, inputBased) => {
    
    return axios.post(`${API_URL}/?typerequest=getProject`,  { id, maketId, inputBased });
}

export const getMakets = (status) => {
    return axios.post(`${API_URL}/?typerequest=getMakets&status=${status}`, {} );
}

export const getMaket = (id) => {
    return axios.post(`${API_URL}/?typerequest=getMaket&id=${id}`,{});
}

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

export const getConfirmationCodeApi = (userID) => {
    return axios.post(`${API_URL}/?typerequest=getConfirmationCode`, { userID });
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

