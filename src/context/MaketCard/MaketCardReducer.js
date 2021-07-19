import {
    OPEN_CARD_MAKET_REQUEST,
    OPEN_CARD_MAKET_FAILURE,
    OPEN_CARD_MAKET_SUCCESS,
    OPEN_EDIT_TASK_REQUEST,
    OPEN_EDIT_TASK_FAILURE,
    OPEN_EDIT_TASK_SUCCESS,
    SWITCH_TAB,
    REMOVE_TASK_FILE,
    ADD_TASK_FILE,
    EDITING_HTML_TEXT,
    SAVE_TASK_REQUEST,
    SAVE_TASK_FAILURE,
    SAVE_TASK_SUCCESS,
    CANCEL_TASK_EDITING,
    ADD_TASK,
    REMOVE_TASK_START,
    REMOVE_TASK_CANCEL,
    REMOVE_TASK_REQUEST,
    REMOVE_TASK_FAILURE,
    REMOVE_TASK_SUCCESS,
    DOWNLOAD_FILE_MAKET_REQUEST,
    DOWNLOAD_FILE_MAKET_FAILURE,
    DOWNLOAD_FILE_MAKET_SUCCESS,
    UPLOAD_FILE_MAKET_REQUEST,
    UPLOAD_FILE_MAKET_FAILURE,
    UPLOAD_FILE_MAKET_SUCCESS,
    DOWNLOAD_FILE_TASK_REQUEST,
    DOWNLOAD_FILE_TASK_FAILURE,
    DOWNLOAD_FILE_TASK_SUCCESS,
    OPEN_FOLDER_FILES_TASK,

    SET_MAKET_STATUS_REQUEST,
    SET_MAKET_STATUS_FAILURE,
    SET_MAKET_STATUS_SUCCESS,
    CLEAR_MESSAGE,

} from "../types"

export const MaketCardReducer = (state, action) => {


    switch (action.type) {


        case CLEAR_MESSAGE:

            if (state.message && state.message.uid == action.payload.uid)
                return {

                    ...state,
                    message: null
                }
            else {
                return state;
            }


        case SET_MAKET_STATUS_REQUEST:
            return {

                ...state,
                statusBeingSet: true
            }
        case SET_MAKET_STATUS_FAILURE:

            if (action.payload.maket) {
                return {
                    ...state,
                    statusBeingSet: false,
                    message: action.payload.message,
                    maket: action.payload.maket,
                }
            } else {
                return {
                    ...state,
                    statusBeingSet: false,
                    message: action.payload.message
                }
            }

        case SET_MAKET_STATUS_SUCCESS:

            return {
                ...state,
                statusBeingSet: false,
                maket: action.payload.maket,
                message: action.payload.message,
                
            }

        case OPEN_FOLDER_FILES_TASK:

            if (state.openFoldersTask.find(idTask => idTask == action.payload.idTask)) {
                return {
                    ...state,
                    openFoldersTask: state.openFoldersTask.filter(idTask => idTask != action.payload.idTask)
                }
            } else {
                return {
                    ...state,
                    openFoldersTask: [...state.openFoldersTask, action.payload.idTask]
                }
            }
        case DOWNLOAD_FILE_TASK_REQUEST:
            return {

                ...state,
                downloadFilesTask: [...state.downloadFilesTask, action.payload.idFile]
            }
        case DOWNLOAD_FILE_TASK_FAILURE:
            return {
                ...state,
                downloadFilesTask: state.downloadFilesTask.filter((idFile) => idFile != action.payload.idFile),
                message: action.payload.message
            }

        case DOWNLOAD_FILE_TASK_SUCCESS:
            return {
                ...state,
                downloadFilesTask: state.downloadFilesTask.filter(idFile => idFile !== action.payload.idFile)
            }

        case UPLOAD_FILE_MAKET_REQUEST:
            return {

                ...state,
                uploadFiles: [...state.uploadFiles, action.payload.idFile]
            }
        case UPLOAD_FILE_MAKET_FAILURE:


            let newState = {
                ...state,
                uploadFiles: state.uploadFiles.filter((idFile) => idFile != action.payload.idFile),
                message: action.payload.message,
                maket: action.payload.maket,
            }

            if (action.payload.maket) {
                newState.maket = action.payload.maket;
            }

            return newState;



        case UPLOAD_FILE_MAKET_SUCCESS:
            return {
                ...state,
                uploadFiles: state.uploadFiles.filter((idFile) => idFile !== action.payload.idFile),
                maket: action.payload.maket
            }


        case DOWNLOAD_FILE_MAKET_REQUEST:
            return {

                ...state,
                downloadFiles: [...state.downloadFiles, action.payload.idFile]
            }
        case DOWNLOAD_FILE_MAKET_FAILURE:
            return {
                ...state,
                downloadFiles: state.downloadFiles.filter((idFile) => idFile != action.payload.idFile),
                message: action.payload.message
            }

        case DOWNLOAD_FILE_MAKET_SUCCESS:
            return {
                ...state,
                downloadFiles: state.downloadFiles.filter(idFile => idFile !== action.payload.idFile)
            }




        case REMOVE_TASK_REQUEST:
            return {
                ...state,
                ...action.payload,
                taskRemove: true
            }

        case REMOVE_TASK_FAILURE:
            return {
                ...state,
                ...action.payload,
                taskRemove: false,
                idTaskRemove: null
            }

        case REMOVE_TASK_SUCCESS:
            return {
                ...state,
                ...action.payload,
                taskRemove: false,
                idTaskRemove: null
            }
        case REMOVE_TASK_START:
            return {
                ...state,
                ...action.payload
            }

        case REMOVE_TASK_CANCEL:
            return {
                ...state,
                idTaskRemove: null
            }

        case ADD_TASK:
            return {
                ...state,
                idTaskChange: -1,
                editorState:action.payload.editorState
            }

        case SAVE_TASK_REQUEST:
            return {
                ...state,
                taskSaved: true
            }

        case SAVE_TASK_SUCCESS:
            return {
                ...state,
                ...action.payload,
                taskSaved: false,
                idTaskChange: null,
                taskChangeFiles: [],
                editorState: null
            }

        case CANCEL_TASK_EDITING:
            return {
                ...state,
                idTaskChange: null,
                taskChangeFiles: [],
                editorState: null
            }

        case SAVE_TASK_FAILURE:
            return {
                ...state,
                ...action.payload,
                taskSaved: false,
            }


        case EDITING_HTML_TEXT:
            return {
                ...state,
                editorState: action.payload,
            }

        case OPEN_EDIT_TASK_REQUEST:
            return {
                ...state,
                idTaskChange: null,
                taskChangeFiles: [],
                taskEditingOpens: true
            }

        case OPEN_EDIT_TASK_FAILURE:
            return {
                ...state,
                taskEditingOpens: false,
                ...action.payload
            }

        case OPEN_EDIT_TASK_SUCCESS:
            return {
                ...state,
                ...action.payload,
                editorState:action.payload.editorState,
                taskEditingOpens: false
            }

        case OPEN_CARD_MAKET_REQUEST:
            return {
                ...state,
                ...action.payload
            }

        case OPEN_CARD_MAKET_FAILURE:
            return {
                ...state,
                maketRequest: false,
                ...action.payload
            }

        case OPEN_CARD_MAKET_SUCCESS:
            return {
                ...state,
                ...action.payload,
                maketRequest: false
            }

        case REMOVE_TASK_FILE:
            return {
                ...state,
                taskChangeFiles: state.taskChangeFiles.filter((file) => file.uid != action.payload),
                cardOpens: false
            }

        case ADD_TASK_FILE:
            return {
                ...state,
                taskChangeFiles: [...state.taskChangeFiles, action.payload],
                cardOpens: false
            }

        case SWITCH_TAB:
            return {
                ...state,
                ...action.payload,
            }


        default:
            return state
    }

}