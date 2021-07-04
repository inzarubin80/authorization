import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import rootReducer from './redux/rootReducer';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { ruRU } from '@material-ui/core/locale';

import FingerprintJS from '@fingerprintjs/fingerprintjs'

const theme = createMuiTheme({
  palette: {
    //  primary: { main: '#1976d2' },
  },
}, ruRU);

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}


const store = createStore(rootReducer, applyMiddleware(thunk, logger));

  
  const fpPromise = FingerprintJS.load()

  fpPromise
  .then(fp => fp.get())
  .then(result => {
    const visitorId = result.visitorId
    console.log("visitorId", visitorId)
  })
  

ReactDOM.render(

  <Provider store={store}>
    <ThemeProvider theme={theme}>

      <App />

    </ThemeProvider>


  </Provider>
  ,
  document.getElementById('root')
);
