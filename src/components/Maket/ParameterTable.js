import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import 'antd/dist/antd.css';



const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 10,
  }

}));


const ParameterTable = ({ maket }) => {

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        
       
       
      <TableBody>
          <TableRow >
            <TableCell component="th" scope="row" >
            Конечный потребитель
              </TableCell>
            <TableCell align="left">
            {maket.finalBuyer}
            </TableCell>
          </TableRow>


          <TableRow >
            <TableCell component="th" scope="row" >
              Вид оболочки
              </TableCell>
            <TableCell align="left">
              {maket.Shell}
            </TableCell>
          </TableRow>


          <TableRow >
            <TableCell component="th" scope="row" >
              Последняя дата печати
              </TableCell>
            <TableCell align="left">
              {maket.printDate}
            </TableCell>
          </TableRow>

         

          <TableRow >
            <TableCell component="th" scope="row" >
             Тип печати
              </TableCell>
            <TableCell align="left">
              {maket.typPrinting}
            </TableCell>
          </TableRow>


          <TableRow >
            <TableCell component="th" scope="row" >
              Цветность
              </TableCell>
            <TableCell align="left">
              {maket.chromaticity}
            </TableCell>
          </TableRow>

          <TableRow >
            <TableCell component="th" scope="row" >
                Количество флексоформ
              </TableCell>
            <TableCell align="left">
              {maket.numberForms}
            </TableCell>
          </TableRow>

          <TableRow >
            <TableCell component="th" scope="row" >
              Калибр/Ширина
              </TableCell>
            <TableCell align="left">
              {maket.caliber}
            </TableCell>
          </TableRow>


        </TableBody>
      </Table>
    </TableContainer>
  );

}


export default ParameterTable