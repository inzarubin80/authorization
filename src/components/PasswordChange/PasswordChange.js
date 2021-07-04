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

import { setPassword} from '../../redux/user/userActions';

import { Alert, AlertTitle } from '@material-ui/lab';

import { withRouter } from "react-router-dom";


import {
  useHistory,
  useLocation
} from "react-router-dom";



const validationSchema = yup.object().shape({
  password: yup.string().required("Это поле обязательно к заполнению")
  //.min(8, 'Пароль слишком короткий - минимум 8 символов.')
  //.matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')

  .matches(
    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
    "Пароль должен содержать не менее 8 символов, одну заглавную  латинскую букву, одну строчную латинскую букву, одну цифру и один специальный символ"
  )
  ,
  
  passwordRepeated: yup.string().required("Пароли должны совпадать")
  .oneOf([yup.ref('password')], 'Пароли должны совпадать')
  
  

});


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

  margin: {
    margin: theme.spacing(1),
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


const PasswordChange = (props) => {


  const dispatch = useDispatch();
  
  console.log(props.match.params.key);

  
  const errPassword = useSelector(state => state.user.errPassword);
  const passwordRequest = useSelector(state => state.user.passwordRequest);

  
  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };

  
  const sb = () => {
    history.replace(from);
  }


  const formik = useFormik({
    initialValues: {
      password:  '',
      passwordRepeated: ''

    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(setPassword(props.match.params.key, values.password, sb))
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
            Установка пароля
         </Typography>

          <form onSubmit={formik.handleSubmit}>
          
            <TextField
              fullWidth
              id="password"

              //type="password"

              name="password"
              label="Новый пароль"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              className={classes.margin}
            />

            <TextField
              fullWidth
              id="passwordRepeated"

             // type="password"

              name="passwordRepeated"
              label="Подтверждение пароля"
              value={formik.values.passwordRepeated}
              onChange={formik.handleChange}
              error={formik.touched.passwordRepeated && Boolean(formik.errors.passwordRepeated)}
              helperText={formik.touched.passwordRepeated && formik.errors.passwordRepeated}
              className={classes.margin}
            />
            
            <Button   className={classes.margin} color="primary" variant="contained" fullWidth type="submit" disabled={passwordRequest}>
              Установить пароль
            </Button>


            {errPassword && !passwordRequest && <Alert severity="error">
              <AlertTitle>  {errPassword}</AlertTitle>
            </Alert>}

          </form>
        </div>
      </Container>
    </div>
  );
};




export default withRouter(PasswordChange)