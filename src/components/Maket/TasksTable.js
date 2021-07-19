import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import 'antd/dist/antd.css';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CardHeader from '@material-ui/core/CardHeader';
import { Empty } from 'antd';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import SaveIcon from '@material-ui/icons/Save';
import FolderIcon from '@material-ui/icons/Folder';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
//import Fade from '@material-ui/core/Fade';

import {alpha} from '@ material-ui / core / styles';


import { MaketCardContext } from '../../context/MaketCard/MaketCardContext';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 10,
    margin: theme.spacing(4, 0, 2),
  },

  title: {
    marginTop: 25
  },

  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 1),
  },


  buttonModal: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },


}));



const TasksTable = () => {

  const { maket,
    idTaskRemove,
    openChangeTask,
    addTask,
    removeTaskStart,
    removeTaskCancel,
    hendleRemoveTask,
    downloadFilesTask,
    handleDownloadFileTask,
    openFoldersTask, hendleOpenFolderFilesTask, taskEditingOpens } = React.useContext(MaketCardContext);



  const folderIsOpen = (idTaskCarent) => {
    return openFoldersTask.find(idTask => idTask == idTaskCarent) ? true : false;
  }



  const classes = useStyles();



  return (

    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={idTaskRemove != null}
        onClose={() => { }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <alpha in={idTaskRemove != null}>

          <div>


            <div className={classes.paper}>
              {/* <h2 id="transition-modal-title">Transition modal</h2>*/}

              {idTaskRemove && <p id="transition-modal-description">{'Уверены что хотите удалить задание ' + maket.tasks.find((task) => task.uid == idTaskRemove).number + '?'}</p>}
            </div>


            <div className={classes.buttonModal}>

              <Button variant="contained" color="primary" onClick={() => { hendleRemoveTask() }}>Да</Button>
              <Button variant="contained" onClick={() => { removeTaskCancel() }}> Нет</Button>

            </div>
          </div>

        </alpha>
      </Modal>


      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        endIcon={<AddCircleIcon />}
        onClick={() => { addTask() }}

        disabled={!maket.allowedAddTask}



      >
        Добавить
      </Button>


      {!maket.tasks.length &&
        <Empty className={classes.title} description={(<h3>Нет заданий</h3>)} />}


      {maket.tasks.length &&

        <TableContainer component={Paper}>


          <Table className={classes.table} size="small" aria-label="a dense table">

            <TableHead>

              <TableRow>

                <TableCell>Задания</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {maket.tasks.map((task) => (
                <TableRow key={task.uid}>

                  <TableCell component="th" scope="row" >


                    <Grid container spacing={0}>

                      <Grid item xs={12}>
                        <CardHeader
                          title={"№" + task.number + " (" + (task.completed?"выполнено": "в работе") + ")"}
                          subheader={task.documentDate}
                        />
                      </Grid>

                      
                    </Grid>

                    <div dangerouslySetInnerHTML={{ __html: task.text }} style={{ backgroundColor: 'rgba(252, 252, 250)', minHeight: 60 }} />

                    <List
                      component="nav"
                      aria-labelledby="nested-list-subheader"

                      className={classes.root}
                    >

                      <ListItem button onClick={() => { hendleOpenFolderFilesTask(task.uid) }}>
                        <ListItemIcon>
                          <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Присоединенные файлы (" + task.files.length + ")"} />
                        {folderIsOpen(task.uid) ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>

                      <Collapse in={folderIsOpen(task.uid)} timeout="auto" unmountOnExit>

                        <List component="div" disablePadding>


                          {task.files.map((file) => <ListItem key={file.uid} button className={classes.nested}>

                            {!downloadFilesTask.find(id => file.uid == id) && <IconButton aria-label="delete" color="primary" onClick={() => { handleDownloadFileTask(task.uid, file.uid) }}>
                              <SaveIcon />
                            </IconButton>}

                            {downloadFilesTask.find(id => file.uid == id) && <CircularProgress />}

                            <ListItemText primary={file.name} />
                          </ListItem>)}

                        </List>


                      </Collapse>
                    </List>

                    <CardHeader
                      subheader={task.uthor}
                    />
                    <CardActions>

                      {!taskEditingOpens && task.сhangeАllowed && <IconButton color="primary" onClick={() => { openChangeTask(task.uid) }}>
                        <EditIcon />
                      </IconButton>}

                      {taskEditingOpens && <CircularProgress/>}

                      {task.сhangeАllowed && <IconButton color="secondary" onClick={() => { removeTaskStart(task.uid) }}>
                        <DeleteIcon />
                      </IconButton>}


                    </CardActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>}

    </div>

  );

}


export default TasksTable