import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


import { useDispatch, useSelector } from 'react-redux';
import { login, openGetCode } from '../../redux/user/userActions';


import { Alert, AlertTitle } from '@material-ui/lab';

//import Fingerprint2 from 'fingerprintjs2';



import { withRouter } from "react-router-dom";

import {
  useHistory,
  useLocation
} from "react-router-dom";

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),

}

);

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

  },
  paperModal: {
    backgroundColor: theme.palette.background.paper,
    //border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  buttonConfirmation: {
    marginTop: theme.spacing(1),

  },

  buttonConfirmationGroup: {
    '& > *': {
      margin: theme.spacing(1),
    },

    alert: {
      maxWidth: '12%'
    }

  }


}));


const LoginPage = (props) => {


  const dispatch = useDispatch();
  const err = useSelector(state => state.user.err);
  const loggingIn = useSelector(state => state.user.loggingIn);

  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };


 
 

  const sb = () => {
    history.replace(from);
  }

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem('userID') || '',
      password: ''

    },
    validationSchema: validationSchema,
    onSubmit: (values) => {


      dispatch(login(values.email, values.password, sb))



    },
  });

  const classes = useStyles();


  return (
    <div>



      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>

          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Авторизация
         </Typography>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />


            <TextField
              fullWidth
              id="password"

              //type="password"

              name="password"
              label="Пароль"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              className={classes.margin}
            />


            <Button color="primary" variant="contained" fullWidth type="submit" disabled={loggingIn}>
              Войти
            </Button>

            <Button color="primary" onClick={()=>dispatch(openGetCode(props.history))}>Забыли пароль?</Button>

            {err && !loggingIn && <Alert severity="error">
              <AlertTitle>  {err}</AlertTitle>
            </Alert>}

          </form>
        </div>
      </Container>
    </div>
  );
};



export default withRouter(LoginPage)