import {
    MAKET_PROJECTS_REQUEST,
    MAKET_PROJECTS_FAILURE,
    MAKET_PROJECTS_SUCCESS,
    CLEAR_MESSAGE,

    GET_PROJECT_REQUEST,
    GET_PROJECT_FAILURE,
    GET_PROJECT_SUCCESS,
    CHANGE_PROJECT_FIELD,

    NEXT_STAGE_REQUEST,
    NEXT_STAGE_FAILURE,
    NEXT_STAGE_SUCCESS,

    ADD_PROJECT_FILE,
    REMOVE_PROJECT_FILE,

    SAVE_PROJECT_MAKET,
    FILLING_CONTROL_FILDS

} from "../types"

export const MaketProjectReducer = (state, action) => {


    console.log(action);
    
    switch (action.type) {


        case FILLING_CONTROL_FILDS:
            return {
                ...state,
                fieldErrors: {...state.fieldErrors, ...action.payload.fieldErrors},
            }

        case SAVE_PROJECT_MAKET:
            return {
                ...state,
                message: action.payload.message,
                idMaket:action.payload.idMaket,
                uidTask:action.payload.uidTask, 
                stageRequest:false

            }

        case REMOVE_PROJECT_FILE:
            return {
                ...state,
                objectImage: { ...state.objectImage, files: state.objectImage.files.filter((file) => file.uid != action.payload) },
            }

        case ADD_PROJECT_FILE:
            return {
                ...state,
                objectImage: { ...state.objectImage, files: [...state.objectImage.files, action.payload] },
                fieldErrors: { ...state.fieldErrors, files: false},
            }


        case NEXT_STAGE_REQUEST:
            return {
                ...state,
                stageRequest: true,
            }

        case NEXT_STAGE_FAILURE:
            return {
                ...state,
                message: action.payload.message,
                stageRequest: false
            }
        case NEXT_STAGE_SUCCESS:
            return {
                ...state,
                stageRequest: false,
                filds: action.payload.filds,
                currentStage: action.payload.currentStage,
                objectImage: action.payload.objectImage,

            }
        case CHANGE_PROJECT_FIELD:

            return {

                ...state,
                objectImage: { ...state.objectImage, [action.payload.fildId]: action.payload.fildValue },
                fieldErrors: { ...state.fieldErrors, [action.payload.fildId]: false},

            }


        case GET_PROJECT_REQUEST:

            return {

                ...state,
                fieldErrors:{},
                message: null,
                stagesProject: [],
                editorState:null,
                projectRequest: true,
                filds: [],
                objectImage: {},
                currentStage: 0,
                uidTask:'',
                idMaket: '',


            }

        case GET_PROJECT_FAILURE:

            return {

                ...state,
                message: action.payload.message,
                projectRequest: false,

            }

        case GET_PROJECT_SUCCESS:

            return {

                ...state,
                projectRequest: false,
                stagesProject: action.payload.stagesProject,
                filds: action.payload.filds,
                objectImage: action.payload.objectImage,
                projectId: action.payload.projectId,
                projects:action.payload.projects,
                uidTask:action.payload.uidTask,
                idMaket:action.payload.idMaket,
                

                
                currentStage: 0

            }



        case MAKET_PROJECTS_REQUEST:

            return {

                ...state,
                message: null,
                projects: [],
                filds: [],
                objectImage: {},
                editorState:null,
                projectsRequest: true,
                currentStage: 0,
                uidTask:'',
                idMaket: '',
                

            }

        case MAKET_PROJECTS_FAILURE:

            return {

                ...state,
                message: action.payload.message,
                projectsRequest: false,

            }

        case MAKET_PROJECTS_SUCCESS:

            return {

                ...state,
                projectsRequest: false,
                projects: action.payload.projects

            }

        case CLEAR_MESSAGE:

            if (state.message && state.message.uid == action.payload.uid)
                return {

                    ...state,
                    message: null
                }
            else {
                return state;
            }

        default:
            return state
    }

}