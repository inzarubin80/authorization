
import { CHANGE_MAKETS_STATUS,
    MAKETS_SGRID_PAGE_CHANGE_PARAMS, 
    MAKETS_FILTER_CHANGE, 
    MAKETS_SORT_CHANGE, 
    MAKETS_SUCCESS,
     MAKETS_FAILURE,
     MAKETS_REQUEST, MAKETS_UPDATE_STATUS_REQUIRED } from '../types'



export const MaketsReducer = (state, action) => {


    switch (action.type) {

        case MAKETS_UPDATE_STATUS_REQUIRED:
            return {
                ...state,
                updateStatusRequired:true

            };
        case CHANGE_MAKETS_STATUS:
            return {
                ...state,
                status: action.payload,

            };

        case MAKETS_SGRID_PAGE_CHANGE_PARAMS:
            return {
                ...state,
                ...action.payload

            };
        case MAKETS_FILTER_CHANGE:

            if  (JSON.stringify(state.filterModel) === JSON.stringify(action.payload)) {
                return state;

            } else {
                return {
                    ...state,
                    page: 0,
                    filterModel: action.payload
                };
            }

        case MAKETS_SORT_CHANGE:

            if  (JSON.stringify(state.sortModel) === JSON.stringify(action.payload)) {
                return state;
            }
            else {
                return {
                    ...state,
                    page: 0,
                    sortModel: action.payload
                };

            }


        case MAKETS_REQUEST:
                return {
                    ...state,
                    makets: [],
                    updateStatusRequired:false,
                   // statusButtons:[],
                  //  status: action.payload.status,
                //    statusButtons:action.payload.statusButtons,
                    maketsIsRequest:true,
                    error:''
                };

        case MAKETS_SUCCESS:
            return {
                ...state,
                makets: action.payload.makets,
                status: action.payload.status,
                statusButtons:action.payload.statusButtons,
                maketsIsRequest:false
            };
           
         case MAKETS_FAILURE:
                return {
                    ...state,
                   // makets:[],
                    statusButtons:[],
                    maketsIsRequest:false,
                    error:action.payload.error
                    
                };
                    


        default:

            return state
    }
}