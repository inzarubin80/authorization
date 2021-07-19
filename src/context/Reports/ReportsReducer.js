import {

    REPORTS_REQUEST,
    REPORTS_SUCCESS,
    REPORTS_FAILURE,
    OPEN_FOLDER_REPORT,

    REPORT_REQUEST,
    REPORT_SUCCESS,
    REPORT_FAILURE,


} from "../types"



export const ReportsReducer = (state, action) => {


   // console.log('action', action);

    switch (action.type) {


        case REPORT_REQUEST:
            return {
                ...state,
                message: null,
                reportHTML: '',
                reportRequest: true,
                nameReport: ''
            }

        case REPORT_SUCCESS:
            return {
                ...state,
                message: null,
                reportHTML: action.payload.reportHTML,
                nameReport: action.payload.nameReport,
                reportRequest: false
            }
        case REPORT_FAILURE:
            return {
                ...state,
                reportRequest: false,
                message: action.payload.message,
            }



        case REPORTS_REQUEST:
            return {
                ...state,
                message: null,
                reportsListRequest: true,
                listReports: [],
                reportGroups: []
            }

        case REPORTS_SUCCESS:
            return {
                ...state,
                message: null,
                reportsListRequest: false,
                listReports: action.payload.listReports,
                reportGroups: action.payload.reportGroups
            }
        case REPORTS_FAILURE:
            return {
                ...state,
                reportsListRequest: false,
                message: action.payload.message,
            }

        case OPEN_FOLDER_REPORT:

            if (state.openFoldersReport.find(id => id == action.payload.id)) {
                return {
                    ...state,
                    openFoldersReport: state.openFoldersReport.filter(id => id != action.payload.id)
                }
            } else {
                return {
                    ...state,
                    openFoldersReport: [...state.openFoldersReport, action.payload.id]
                }
            }
        default:
            return state
    }

}