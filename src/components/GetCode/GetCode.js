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
import { getConfirmationСode, getKeyChange, openGetCode} from '../../redux/user/userActions';
import { Alert, AlertTitle } from '@material-ui/lab';

import { withRouter } from "react-router-dom";

import {
    useHistory,
    useLocation
} from "react-router-dom";

const validationSchema = yup.object({
    email: yup
        .string('Введите адрес электронной почты')
        .email('Введите действующий адрес электронной почты')
        .required('Электронная почта обязательна'),
});


const validationSchemaСonfirmation = yup.object({
    code: yup
        .string()
        .required('Заполните код подтверждения'),
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


const GetCode = (props) => {


    const dispatch = useDispatch();
    const err = useSelector(state => state.user.errorConfirmationCode);
    const confirmationСodeSent = useSelector(state => state.user.confirmationСodeSent);
    const confirmationСodeRequested = useSelector(state => state.user.confirmationСodeRequested);

    console.log("confirmationСodeSent", confirmationСodeSent);

    //let history = useHistory();
    //let location = useLocation();

    //let { from } = location.state || { from: { pathname: "/" } };


    const formik = useFormik({
        initialValues: {
            email: localStorage.getItem('userID') || '',
            code: ''

        },
        validationSchema: confirmationСodeSent?validationSchemaСonfirmation:validationSchema,
        onSubmit: (values) => {

            if (confirmationСodeSent) {

                dispatch(getKeyChange(values.email, values.code, props.history));

            } else {
                dispatch(getConfirmationСode(values.email))
            }


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

                    {!confirmationСodeSent && <Typography className={classes.margin} variant="h7">
                        На указанный адрес будет отправлено письмо с кодом подтверждения
          </Typography>}


                    {confirmationСodeSent && <Typography className={classes.margin} variant="h7">

                        Проверьте электронную почту.
                        Вы получите код подтверждения,
                        который нужно будет ввести здесь, что бы сбросить пароль.

          </Typography>}

                    <form onSubmit={formik.handleSubmit}>

                        <TextField

                            className={classes.margin}
                            disabled={confirmationСodeSent}
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />

                        {confirmationСodeSent && <TextField

                            className={classes.margin}
                            fullWidth
                            id="code"
                            name="code"
                            label="Код подтверждения"
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            error={formik.touched.code && Boolean(formik.errors.code)}
                            helperText={formik.touched.code && formik.errors.code}
                        />}


                        {!confirmationСodeSent && <Button color="primary" variant="contained" fullWidth type="submit" disabled={confirmationСodeRequested}>
                            Получить код подтверждения
            </Button>}

                        {confirmationСodeSent && <Button color="primary" variant="contained" fullWidth type="submit" disabled={confirmationСodeRequested}>
                           Подтвердить
            </Button>}

            {confirmationСodeSent && err &&  <Button color="primary" onClick={()=>dispatch(openGetCode(props.history))}>Повторить отправку</Button>}


                        {err && !confirmationСodeRequested && <Alert severity="error">
                            <AlertTitle>  {err}</AlertTitle>
                        </Alert>}

                    </form>
                </div>
            </Container>
        </div>
    );
};




export default withRouter(GetCode)