import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import SaveIcon from '@material-ui/icons/Save';
import BackupIcon from '@material-ui/icons/Backup';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardActions from '@material-ui/core/CardActions';
import { MaketCardContext } from '../../context/MaketCard/MaketCardContext';

const useStyles = makeStyles((theme) => ({

    table: {
        minWidth: 10,
    },


    rootButton: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    inputButton: {
        display: 'none',
    },
}));


const FilesTable = () => {



    const { maket, handleDownload, downloadFiles, handleUploadFile, uploadFiles } = React.useContext(MaketCardContext);
    const classes = useStyles();


    

    return (
        <div>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>

                            <TableCell>Файл</TableCell>
                            {maket.allowedUploadingConfirmationFiles && <TableCell>Файл подтверждения</TableCell>}

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {maket.files.map((file) => (
                            <TableRow key={file.id}>

                                <TableCell component="th" scope="file" >

                                    {file.shortfileName}

                                    <CardActions>


                                        {!downloadFiles.find(id => id == file.id) &&
                                            <IconButton
                                                style={{ 'display': 'inlineBlock' }}
                                                aria-label="delete" color="primary"
                                                onClick={() => { handleDownload(file.id, file.code, file.fileName) }}>
                                                <SaveIcon />
                                            </IconButton>}

                                        {downloadFiles.find(id => id == file.id) &&
                                            <CircularProgress />
                                        }

                                    </CardActions>

                                </TableCell>


                                {maket.allowedUploadingConfirmationFiles && <TableCell component="th">


                                    {file.shortfileNameСonfirmation}
                                    <CardActions>

                                        <div className={classes.rootButton}>
                                            <input

                                                accept="image/*"
                                                className={classes.inputButton}
                                                id={"contained-button-file" + file.idConf}
                                                type="file"


                                                onChange={(e) => handleUploadFile(file.idConf, file.code, e.target.files[0], file.fileName, file.shortfileName)}

                                            />
                                            <label htmlFor={"contained-button-file" + file.idConf}>

                                                {!uploadFiles.find(idConf => idConf == file.idConf) && <IconButton
                                                    aria-label="download"
                                                    variant="contained"
                                                    color="primary"
                                                    component="span">
                                                    <BackupIcon />
                                                </IconButton>}

                                                {uploadFiles.find(idConf => idConf == file.idConf) &&
                                                    <CircularProgress />
                                                }


                                            </label>
                                        </div>

                                    </CardActions>
                                </TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    );
}

export default FilesTable