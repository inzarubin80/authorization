import React, { useReducer } from 'react'

import {
    CHANGE_MAKETS_STATUS,
    MAKETS_SGRID_PAGE_CHANGE_PARAMS,
    MAKETS_FILTER_CHANGE,
    MAKETS_SORT_CHANGE,
    MAKETS_SUCCESS,
    MAKETS_FAILURE,
    MAKETS_REQUEST, MAKETS_UPDATE_STATUS_REQUIRED
} from '../types'

import { MaketsContext } from './MaketsContext'
import { MaketsReducer } from './MaketsReducer'
import { useDispatch } from 'react-redux';
import { getMakets, executorRequests } from '../../api/dataService1c';

export const MaketsState = ({ children }) => {

    const initialState = {
        status: null,
        page: 0,
        pageSize: 10,
        filterModel: { linkOperator: "and", items: [] },
        sortModel: [],
        makets: [],
        statusButtons: [],
        maketsIsRequest: false,
        error: '',
        updateStatusRequired: false

    }

    const dispatchRedux = useDispatch();
    const [state, dispatch] = useReducer(MaketsReducer, initialState);


    const maketsUpdateStatusRequired = () => {
        return {
            type: MAKETS_UPDATE_STATUS_REQUIRED
        };
    };

    const changeMaketsStatus = (status) => {
        return {
            type: CHANGE_MAKETS_STATUS,
            payload: status,
        };
    };

    const сhangePageParams = (pageSize, page) => {
        dispatch({
            type: MAKETS_SGRID_PAGE_CHANGE_PARAMS,
            payload: { pageSize, page }
        })
    };

    const сhangeFiltr = (filterModel) => {
        dispatch({
            type: MAKETS_FILTER_CHANGE,
            payload: filterModel
        })
    };

    const сhangeSort = (sortModel) => {
        dispatch({
            type: MAKETS_SORT_CHANGE,
            payload: sortModel
        })
    };

    const failure = () => {
        return {
            type: MAKETS_FAILURE
        };
    };

    const setMaketsStatus = (status) => {



        dispatch({ type: MAKETS_REQUEST });

        const functionRequest = () => {
            return getMakets(status);
        };

        const responseHandlingFunction = (data) => {
            return dispatch({ type: MAKETS_SUCCESS, payload: { status, makets: data.makets, statusButtons: data.statusButtons } });
        }
        const exceptionHandlingFunction = (error) => {
            return dispatch({ type: MAKETS_FAILURE, payload: { error } });
        };

        executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatchRedux);


    }


    return (
        <MaketsContext.Provider value={{
            status: state.status,
            page: state.page,
            pageSize: state.pageSize,
            filterModel: state.filterModel,
            sortModel: state.sortModel,
            maketsAr: state.makets,
            statusButtons: state.statusButtons,
            maketsIsRequest: state.maketsIsRequest,
            error: state.error,
            updateStatusRequired: state.updateStatusRequired,
            сhangePageParams,
            сhangeFiltr,
            сhangeSort,
            setMaketsStatus
        }}>{children}</MaketsContext.Provider>)

}