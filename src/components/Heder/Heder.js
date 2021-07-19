import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';

import AssessmentIcon from '@material-ui/icons/Assessment';

import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../redux/user/userActions';


import {
  Link,
} from "react-router-dom";

//const drawerWidth = 240;

const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

  toolbarButtons: {
    marginLeft: 'auto',
  },

  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },



  link: {

  }

}));

export default function Heder(props) {


  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const handleDrawerOpen = () => {
    setOpen(true);
  };


  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  //let { path, url } = useRouteMatch();

  const handleDrawerClose = () => {
    setOpen(false);
  };




  return (

    <div>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar

          //position="fixed"
          //position="static"

          position="sticky"


          //    className={clsx(classes.appBar, {
          //    [classes.appBarShift]: open,
          // })}
          className={classes.appBar}

        >
          <Toolbar>


            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" className={classes.title} component={Link} to={"/"} style={{ color: '#FFF' }}>
               Authorization
           </Typography>


            {isLoggedIn && <div className={classes.toolbarButtons}>

              <Button color="inherit" onClick={() => { dispatch(logOut()) }}>Выйти</Button>

            </div>}

          </Toolbar>

        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>

          <ListItem onClick={handleDrawerClose} component={Link} to={"/projects"} button key={'projects'}>
              <ListItemIcon>   <InboxIcon /> </ListItemIcon>
              <ListItemText primary={"Проекты"} />
            </ListItem>



          </List>
          <Divider />

        </Drawer>



      </div>

      {false && <h1>Глобальное сообщение</h1>}
    </div>
  );
}