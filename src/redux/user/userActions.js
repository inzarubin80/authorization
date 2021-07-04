import {
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGIN_LOGOUT,
  
  CONFIRMATION_CODE_REQUEST,
  CONFIRMATION_CODE_FAILURE,
  CONFIRMATION_CODE_SUCCESS,


  CLEAR_ERROR,
  CANCEL_CONFIRMATION,

  SET_PASSWORD_REQUEST,
  SET_PASSWORD_SUCCESS,
  SET_PASSWORD_FAILURE,

  GETTING_KEY_CHANGE_PASSWORD_REQUEST,
  GETTING_KEY_CHANGE_PASSWORD_SUCCESS,
  GETTING_KEY_CHANGE_PASSWORD_FAILURE,

  OPEN_GET_CODE,

} from '../types'

import { executorRequests, getConformationCodeApi, login as loginApi, passwordChange,getKeyChangeApi } from '../../api/dataService1c';


const setLoginSuccess = (loginData) => {
  return {
    type: LOGIN_SUCCESS
  };
};

export const cancelConformation = () => {
  return {
    type: CANCEL_CONFIRMATION
  };
};




const setLoginRequest = () => {
  return {
    type: LOGIN_REQUEST
  };
};

const setLoginFailure = (err) => {

  return {
    type: LOGIN_FAILURE,
    payload: err,
  };
};


export const logOut = (loginData) => {
  localStorage.removeItem('accessToken')
  
  return {
    type: LOGIN_LOGOUT
  };
};

export const сlearError = () => {
  return {
    type: CLEAR_ERROR
  };
}


export const login = (email,password, cb) => {


  return (dispatch, getState) => {


    const state = getState()


    dispatch(setLoginRequest());

    const functionRequest = () => {
      return loginApi(email, password);
    };

    const responseHandlingFunction = (json) => {

      if (json.error) {
        dispatch(setLoginFailure(json.error));
      } else {

        dispatch(setLoginSuccess());
        localStorage.setItem('accessToken', json.accessToken)
        //localStorage.setItem('userID', state.user.userID)
        cb();

      }
    }

    const exceptionHandlingFunction = (error) => {
      dispatch(setLoginFailure(error));
    };

    executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatch);

  };
}

////////////////////////////////////////////////////////////////////
const setPasswordRequest = () => {
  return {
    type: SET_PASSWORD_REQUEST
  };
}

const setPasswordFailure = (err) => {
  return {
    type: SET_PASSWORD_FAILURE,
    payload: err
  };
}

const setPasswordSuccess = () => {
  return {
    type: SET_PASSWORD_SUCCESS
  };
}

export const setPassword = (passwordСhangeKey, password, cb) => {

  return (dispatch) => {

    dispatch(setPasswordRequest())

    const functionRequest = () => {
      return passwordChange(passwordСhangeKey, password);
    };

    const responseHandlingFunction = (json) => {

      if (json.error) {
        dispatch(setPasswordFailure(json.error));
      } else {

        dispatch(setPasswordSuccess());
       // localStorage.setItem('userID', json.userID)
        localStorage.setItem('accessToken', json.accessToken)
          
        cb();

      }
    }

    const exceptionHandlingFunction = (error) => {
      dispatch(setPasswordFailure(error));
    };

    executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatch);

  }

}

///////////////////////////////////////////////////////////////////

export const getConformationCodeRequest = (userID) => {
  return {
    type: CONFIRMATION_CODE_REQUEST,
    payload: { userID}
  };
}

export const getConformationCodeFailure = (err) => {
  return {
    type: CONFIRMATION_CODE_FAILURE,
    payload: err
  };
}

export const getConformationCodeSuccess = (requestKey) => {
  return {
    type: CONFIRMATION_CODE_SUCCESS,
    payload: requestKey
  };
}


export const getConfirmationСode = (userID) => {

  //const requestKey = uuidv4();

  return (dispatch) => {


    dispatch(getConformationCodeRequest(userID));

    const functionRequest = () => {
      return getConformationCodeApi(userID);
    };

    const responseHandlingFunction = (json) => {
      
      if (json.error) {
        dispatch(getConformationCodeFailure(json.error));
      } else {
        dispatch(getConformationCodeSuccess(json.requestKey));
      }
    }

    const exceptionHandlingFunction = (error) => {
      dispatch(getConformationCodeFailure(error));
    };

    executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatch);

  };
}


///////////////////////////////////////////////////////////////////


export const getKeyChangeRequest = () => {
  return {
    type:     GETTING_KEY_CHANGE_PASSWORD_REQUEST,
    
  };
}

export const getKeyChangeFailure = (err) => {
  return {
    type: GETTING_KEY_CHANGE_PASSWORD_FAILURE,
    payload: err
  };
}

export const getKeyChangeSuccess = () => {
  return {
    type: GETTING_KEY_CHANGE_PASSWORD_SUCCESS
  };
}


export const getKeyChange = (userID, code, history) => {

  return (dispatch, getState) => {


    dispatch(getKeyChangeRequest());

    const functionRequest = () => {
      return getKeyChangeApi(userID, getState().user.requestKey, code);
    };

    const responseHandlingFunction = (json) => {
      
      if (json.error) {
        dispatch(getKeyChangeFailure(json.error));
      } else {
        
        dispatch(getKeyChangeSuccess());
        history.push({ pathname: '/password-change/' + json.key })

      }
    }

    const exceptionHandlingFunction = (error) => {
      dispatch(getKeyChangeFailure(error));
    };
    executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatch);
  };
}
/////////////////////////////////////////////////////////////////////////////////

export const openGetCode = (history)=>{

  history.push({ pathname: '/get-code'});
  return {
    type: OPEN_GET_CODE
  };

}

