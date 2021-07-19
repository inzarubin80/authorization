import React, { useReducer } from 'react'
import {

    REPORTS_REQUEST,
    REPORTS_SUCCESS,
    REPORTS_FAILURE,
    CLEAR_MESSAGE,
    OPEN_FOLDER_REPORT,

    REPORT_REQUEST,
    REPORT_SUCCESS,
    REPORT_FAILURE,


} from '../types'
import { ReportsContext } from './ReportsContext'
import { ReportsReducer } from './ReportsReducer'
import { createMessage, alertTypes } from '../../utils/utils';
import { executorRequests, getListReports, getReportHTML } from '../../api/dataService1c';
import { useDispatch} from 'react-redux';

export const ReportsState = ({ children }) => {
    const initialState = {
        message: null,
        reportsListRequest: false,
        listReports: [],
        reportGroups: [],
        openFoldersReport:[],
        reportHTML:'',
        nameReport:'',
        reportRequest: false,


    }

    const constStandartLifetime = 3500;

    const dispatchRedux = useDispatch();
    const [state, dispatch] = useReducer(ReportsReducer, initialState)


    const reportRequest = () => {
        dispatch({ type: REPORT_REQUEST })
    }

    const reportSuccess = (reportHTML, nameReport) => {
        dispatch({ type: REPORT_SUCCESS, payload: { reportHTML, nameReport} })
    }

    const reportFailure = (err) => {
        dispatch({ type: REPORT_FAILURE, payload: { message: createMessage(alertTypes.info, err, clearMessage, constStandartLifetime) } })
    }

    const hendleGetReport = (id) => {

        reportRequest();

        const functionRequest = () => {
            return getReportHTML(id)
        };

        const responseHandlingFunction = (json) => {
            
            reportSuccess(json.reportHTML, json.nameReport)

        };

        const exceptionHandlingFunction = (error) => {
            reportFailure(error);
        }

        executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatchRedux)



    }

    const hendleOpenFolderReports = (id) => {
        dispatch({ type: OPEN_FOLDER_REPORT, payload: {id}})
    }


    const clearMessage = (uid) => {
        dispatch({ type: CLEAR_MESSAGE, payload: { uid } })
    }

    const reportsRequest = () => {
        dispatch({ type: REPORTS_REQUEST })
    }

    const reportsSuccess = (listReports, reportGroups) => {
        dispatch({ type: REPORTS_SUCCESS, payload: { listReports, reportGroups} })
    }
    const reportsFailure = (err) => {
        dispatch({ type: REPORTS_FAILURE, payload: { message: createMessage(alertTypes.info, err, clearMessage, constStandartLifetime) } })
    }

    const hendleGetReportList = () => {
        reportsRequest();

        const functionRequest = () => {
            return getListReports()
        };

        const responseHandlingFunction = (json) => {
            reportsSuccess(json.listReports, json.reportGroups)
        };

        const exceptionHandlingFunction = (error) => {
            reportsFailure(error);
        }

        executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatchRedux)

    }
    return (
        <ReportsContext.Provider value={{
            message: state.message,
            reportsListRequest:state.reportsListRequest,
            reportGroups:state.reportGroups,
            listReports:state.listReports,
            openFoldersReport:state.openFoldersReport,
            reportHTML:state.reportHTML,
            reportRequest:state.reportRequest,
            nameReport:state.nameReport,
            hendleGetReport,
            hendleGetReportList,
            hendleOpenFolderReports
        }}>{children}</ReportsContext.Provider>)

}