import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { executorRequests, testPrivateRequest } from '../../api/dataService1c';
import Button from '@material-ui/core/Button';
import axios from 'axios'


const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },





    paper: {
        textAlign: 'center',
        width: '80%',
        //color: theme.palette.text.secondary,
        margin: '0 auto',
        marginBottom: '35px'

    },

}),
);


export default function Start() {

    const classes = useStyles();

    const dispatch = useDispatch();



    const [time, setTime] = React.useState('');
    const [numberSessions, setNumberSessions] = React.useState('');

    const testHendle = () => {

        const functionRequest = () => {
            return testPrivateRequest();
        };

        const responseHandlingFunction = (json) => {

            if (json.error) {
                exceptionHandlingFunction('')
            } else {
                setTime(json.time);
                setNumberSessions(json.numberSessions); 
            }
        }

        const exceptionHandlingFunction = (error) => {
            setTime('');
            setNumberSessions(''); 
        };
        
        executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatch)  

       
    }



    return (
        <div className={classes.root}>

            <Typography xs={12} variant="h6" component="h6">
                Тест вызова защищенного api 1c
            </Typography>
  
            <Typography variant="body2" color="textSecondary" component="p">
                Время серверва 1с:  {time}
            </Typography>

            
            <Button variant="contained" color="primary" onClick={() => testHendle()}>
              Вызов
            </Button>


        </div>
    );
}