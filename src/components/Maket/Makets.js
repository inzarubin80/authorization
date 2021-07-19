import * as React from 'react';

import { XGrid } from '@material-ui/x-grid';


import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';

import {
  Link
} from "react-router-dom";
import ImageIcon from '@material-ui/icons/Image';
import Gridstrings from './Gridstrings'
import Icon from '@material-ui/core/Icon';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';

import { MaketsContext } from '../../context/Makets/MaketsContext';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(1),
  },

  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },

  buttonAll: {
    marginLeft: 4
  },



  buttonAdd: {
    marginLeft: 10,
    height: '70%'
  },


  actions: {
    // textAlign:'left',
    justifyContent: 'left',
    alignItems: 'center',
    height: '56px',
    display: 'flex',
    // justifyContent: 'center',
    backgroundColor: '#fff'

  },

  actions_: {
    height: '56px',

  }


}));

const columns = [
  {
    field: 'code', headerName: 'Код', width: 100, type: 'string', renderCell: (params) => {

      return params.row.status == 'Проект' ?
        (
          <strong>
            {<Link to={`/maket-project/${params.value}`}>{params.value}</Link>}
          </strong>
        )
        :
        (
          <strong>
            {<Link to={`/makets/${params.value}`}>{params.value}</Link>}
          </strong>
        )

    },
  },
  
  { field: 'name', headerName: 'Наименование', width: 450, type: 'string' },
  { field: 'description', headerName: 'Описание', width: 450, type: 'string' },

];

export default function Makets() {


  const { status, page, pageSize, filterModel, sortModel, maketsAr, statusButtons, maketsIsRequest, error, updateStatusRequired, сhangePageParams, сhangeFiltr, сhangeSort, setMaketsStatus } = React.useContext(MaketsContext);

  const classes = useStyles();

  const handleChangeBottomNavigation = (event, newStatus) => {

    setMaketsStatus(newStatus)

  };

  React.useEffect(() => {
    if (status == null) {
      setMaketsStatus('')
    } else if (updateStatusRequired) {
      setMaketsStatus(status)
    }

  }, [status, updateStatusRequired]);




  return (
    <div>
      <Grid container spacing={0}>

        <Grid item xs={12} value={2}>
          <div className={classes.actions}>

            <Link to="maket-project/new">

              <Button
                className={classes.buttonAdd}
                startIcon={<AddCircleIcon />}

                variant="outlined"

                color="primary"
                size="small"
              >
                Добавить макет
              </Button>

            </Link>
          </div>
        </Grid>
      </Grid>


      <Grid item xs={12}>
        {error && <Alert severity="error">{error}</Alert>}
      </Grid>
      <XGrid 
        columns={columns}
        rowsPerPageOptions={[5, 10, 25, 35, 50, 70, 100]}
        rowHeight={25}
        rows={maketsAr}

      />
    {/*  <DataGrid

        rowsPerPageOptions={[5, 10, 25, 35, 50, 70, 100]}
        rowHeight={25}
        rows={maketsAr}
        columns={columns}
        pageSize={pageSize}
        autoHeight={true}
        sortModel={sortModel}
        page={page}
        filterModel={filterModel}
        hideFooterSelectedRowCount={true}
        onPageSizeChange={(GridPageChangeParams) => { сhangePageParams(GridPageChangeParams.pageSize, 0) }}
        onPageChange={(GridPageChangeParams) => { сhangePageParams(GridPageChangeParams.pageSize, GridPageChangeParams.page) }}
        onFilterModelChange={(GridFilterModelParams) => { сhangeFiltr(GridFilterModelParams.filterModel) }}
        onSortModelChange={(GridSortModelParams) => сhangeSort(GridSortModelParams.sortModel)}
        labelRowsPerPage={(<h1>Макетов на странице</h1>)}
        localeText={Gridstrings}
    /> */}

      <div className={classes.actions_}>
      </div>


      <BottomNavigation value={status} onChange={handleChangeBottomNavigation} className={classes.stickToBottom} showLabels>
        `<BottomNavigationAction label="Все" value="" icon={<ImageIcon />} className={classes.buttonAll} />

        {statusButtons.map((statusButton) => (
          <BottomNavigationAction key={statusButton.id} label={statusButton.name} value={statusButton.id} icon={(<Icon> {statusButton.icon}</Icon>)} />
        ))}


      </BottomNavigation>


    </div>

  );
}
