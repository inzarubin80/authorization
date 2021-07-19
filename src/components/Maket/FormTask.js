import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import HTMLEditor from './HTMLEditor'
import CircularProgress from '@material-ui/core/CircularProgress';
import { MaketCardContext } from '../../context/MaketCard/MaketCardContext';

import AttachedFiles from '../AttachedFiles/AttachedFiles';

let d = 2;

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 10,
    margin: theme.spacing(4, 0, 2),
  },

  title: {
    marginTop: 25
  },


  listFiles: {
    marginTop: 25
  },

  taskСhanges: {
    //  borderWidth: '1px',
    //borderStyle: 'solid',
    //  borderСolor: '#777',
    //padding: '7px'

  },

  input: {
    display: 'none',
  },

  buttonGroup: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },



}));

const FormTask = () => {

  const classes = useStyles();
  const { maket, idTaskChange, taskChangeFiles, editorState, removeTaskFile, addTaskFile, editingHtmlText, handleSaveTask, cancelTaskEditing,taskSaved} = React.useContext(MaketCardContext);
  const task = maket.tasks.find((task) => task.uid == idTaskChange);

  
  return (
    <div className={classes.taskСhanges}>

      <div className={classes.buttonGroup}>


      {!taskSaved&&
        <Button variant="contained" color="secondary" onClick={() => cancelTaskEditing()}>Отмена</Button>
      }

        {!taskSaved&&
        <Button style={{ 'marginTop': 10 }} variant="contained" color="primary" onClick={() => handleSaveTask()}>
          {(!task) ? 'Добавить задание' : "Обновить задание"}
        </Button>}

        {taskSaved&&
        <CircularProgress/>}


      </div>

      <Typography variant="h6" className={classes.title}>
        Задание {(!task) ? ' *' : "№ " + task.number}
      </Typography>



      <HTMLEditor editorState={editorState} setEditorState={editingHtmlText} />

      <AttachedFiles files= {taskChangeFiles} removeFile = {removeTaskFile} addFile = {addTaskFile} />


    </div>

  );

}


export default FormTask