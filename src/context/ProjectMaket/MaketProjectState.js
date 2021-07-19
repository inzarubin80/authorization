import React, { useReducer } from 'react'
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
    FILLING_CONTROL_FILDS,



} from '../types'

import { MaketProjectContext } from './MaketProjectContext'
import { MaketProjectReducer } from './MaketProjectReducer'
import { executorRequests, getProjectsMakets, getProjectApi, nextStepProject } from '../../api/dataService1c';
import { useDispatch } from 'react-redux';
import { createMessage, alertTypes } from '../../utils/utils';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html'


//import { maketsUpdateStatusRequired } from '../../redux/makets/maketsActions'


export const MaketProjectState = ({ children }) => {

    const initialState = {

        projects: [],
        projectsRequest: false,
        message: null,
        projectId: '',
        stagesProject: [],
        projectRequest: false,
        filds: [],
        objectImage: {},
        stageRequest: false,
        currentStage: 0,
        uidTask: '',
        idMaket: '',
        fieldErrors: {}

    }

    const dispatchRedux = useDispatch();
    const [state, dispatch] = useReducer(MaketProjectReducer, initialState)
    const constStandartLifetime = 3500;


    //utils////////////////////////////////////////////////////////////////////////////////////////////////
    const transformObjectImageFrom1c = (filds, objectImage1c) => {

        let objectImage = { ...objectImage1c };

        filds.forEach(fild => {

            if (fild.type == 'htmlText') {
                const contentBlock = htmlToDraft(objectImage1c[fild.id]);

                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    objectImage[fild.id] = EditorState.createWithContent(contentState);
                } else {
                    objectImage[fild.id] = EditorState.createEmpty();
                }
            }
        });
        return objectImage;
    }


    const transformObjectImageTo1c = (filds, objectImage) => {

        let objectImage1c = { ...objectImage };

        filds.forEach(fild => {
            if (fild.type == 'htmlText') {
                objectImage1c[fild.id] = draftToHtml(convertToRaw(objectImage1c[fild.id].getCurrentContent()));
            }
        });

        return objectImage1c;

    }


    
    const fildIsVisible = (fild) => {


        if (!fild.visibilityСonditions.length) {
            return true;
        }

        for (let i = 0; i < fild.visibilityСonditions.length; i++) {
            if (state.objectImage[fild.visibilityСonditions[i].idFieldParent] == fild.visibilityСonditions[i].valueParent) {
                return true;
            }
        }
        return false;
    }

    //ProjectFile ////////////////////////////////////////////////////////////////////////////////////////
    const addProjectFile = (file) => {
        dispatch({ type: ADD_PROJECT_FILE, payload: file })
    }


    const removeProjectFile = (uid) => {
        dispatch({ type: REMOVE_PROJECT_FILE, payload: uid })
    }


    //nextStage ////////////////////////////////////////////////////////////////////////////////////////
    const nextStageRequest = () => {
        return dispatch({ type: NEXT_STAGE_REQUEST })
    }
    const nextStageFailure = (error) => {

        const message = createMessage(alertTypes.info, error, clearMessage, constStandartLifetime);
        return dispatch({ type: NEXT_STAGE_FAILURE, payload: { message } })

    }

    const nextStageSuccess = (filds, currentStage, objectImage1c) => {
        let objectImage = transformObjectImageFrom1c(filds, objectImage1c);
        objectImage.files = state.objectImage.files;
        return dispatch({ type: NEXT_STAGE_SUCCESS, payload: { filds, currentStage, objectImage } })
    }

    const clearMessagesaveMaketSuccess = (history) => {
        return (uid) => {
           // dispatchRedux(maketsUpdateStatusRequired());
            history.push({ pathname: '/makets' })
            clearMessage(uid);
        }
    }

    const saveMaketSuccess = (objectsRecipients, history) => {

        const message = createMessage(alertTypes.success, "Записан макет " + objectsRecipients.idMaket, clearMessagesaveMaketSuccess(history));
        return dispatch({ type: SAVE_PROJECT_MAKET, payload: { message, idMaket: objectsRecipients.idMaket, uidTask: objectsRecipients.uidTask } })

    }


    const nextStage = (progress, history, idMaket) => {


        let objectImage1c = transformObjectImageTo1c(state.filds, state.objectImage);
        const objectsRecipients = {idMaket, uidTask: state.uidTask };


        let fieldErrors = {};


        for (let i = 0; i < state.filds.length; i++) {

            if (progress) {
                
                fieldErrors[state.filds[i].id] = false;

                if (state.filds[i].emptyСontrol && fildIsVisible(state.filds[i])) {

                   
                    if (state.filds[i].type == 'htmlText' )  {

                        const getCurrentContent = state.objectImage[state.filds[i].id].getCurrentContent();
                        const blocks = convertToRaw(getCurrentContent).blocks;
                        const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
                        var value_ = value.replace("\n", '').trim();
                        if (value_=='') {
                            fieldErrors[state.filds[i].id] = true;
                        }

                    } else if (state.filds[i].type == 'inputFiles') {

                        if (!state.objectImage[state.filds[i].id].length) {
                            fieldErrors[state.filds[i].id] = true;
                        }


                    } else if (!objectImage1c[state.filds[i].id]) {
                        fieldErrors[state.filds[i].id] = true;
                    }

                }
            }
        }

        dispatch({ type: FILLING_CONTROL_FILDS, payload: { fieldErrors } })


        if (Object.values(fieldErrors).filter(value=>value).length) {
            return;
        }


        nextStageRequest();



        const functionRequest = () => {
            const isSave = (state.currentStage == (state.stagesProject.length - 1) && progress);
            return nextStepProject(state.projectId, state.currentStage, objectImage1c, progress, objectsRecipients, isSave)
        };

        const responseHandlingFunction = (json) => {

            if (json.error) {

                nextStageFailure(json.error);

            } else {


                if (!json.objectSaved) {
                    nextStageSuccess(json.filds, json.currentStage, json.objectImage);
                } else {
                    saveMaketSuccess(json.objectsRecipients, history)
                }

            }

        }

        const exceptionHandlingFunction = (error) => {
            nextStageFailure(error);
        }

        executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatchRedux);

    }

    //changeProjectField////////////////////////////////////////////////////////////////////////////////////////////////
    const changeProjectField = (fildId, fildValue) => {

        return dispatch({ type: CHANGE_PROJECT_FIELD, payload: { fildId, fildValue } })
    }



    //GET PROJECTS LIST///////////////////////////////////////////////////////////////////////////////////////////////////

    const projectsRequest = () => {
        return dispatch({ type: MAKET_PROJECTS_REQUEST })
    }

    const projectsFailure = (error) => {
        return dispatch({ type: MAKET_PROJECTS_FAILURE, payload: { message: createMessage(alertTypes.info, error, clearMessage, constStandartLifetime) } })
    }

    const projectsSuccess = (projects, filds) => {
        return dispatch({ type: MAKET_PROJECTS_SUCCESS, payload: { projects, filds } })
    }


    const getProjects = () => {

        projectsRequest();


        const functionRequest = () => {
            return getProjectsMakets()
        };

        const responseHandlingFunction = (json) => {

            projectsSuccess(json.projects);

        }

        const exceptionHandlingFunction = (error) => {
            projectsFailure(error);
        }

        executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatchRedux);

    };


    //clearMessage///////////////////////////////////////////////////////////////////////////////////////////

    const clearMessage = (uid) => {
        dispatch({ type: CLEAR_MESSAGE, payload: { uid } })
    }



    //SELECT Project///////////////////////////////////////////////////////////////////////////////////////////////////////
    const projectRequest = () => {
        return dispatch({ type: GET_PROJECT_REQUEST })
    }

    const getProjectSuccess = (stagesProject, filds, objectImage1c, projectId, projects, uidTask, idMaket) => {
        let objectImage = transformObjectImageFrom1c(filds, objectImage1c);
        return dispatch({ type: GET_PROJECT_SUCCESS, payload: { stagesProject, filds, objectImage, projectId, projects, uidTask, idMaket } })
    }


    const getProjectFailure = (error) => {
        return dispatch({ type: GET_PROJECT_FAILURE, payload: { message: createMessage(alertTypes.info, error, clearMessage, constStandartLifetime) } })
    }


    const getProject = (projectId = '', maketId = '', inputBased = false) => {

        if (projectId || maketId) {


            projectRequest();


            const functionRequest = () => {
                return getProjectApi(projectId, maketId, inputBased)
            };

            const responseHandlingFunction = (json) => {

                if (json.error) {
                    getProjectFailure(json.error)
                } else {
                    getProjectSuccess(json.stagesProject, json.filds, json.objectImage, json.projectId, json.projects, json.uidTask, json.idMaket);
                }

            }

            const exceptionHandlingFunction = (error) => {
                getProjectFailure(error);
            }

            executorRequests(functionRequest, responseHandlingFunction, exceptionHandlingFunction, dispatchRedux);
        } else {

            getProjectSuccess([], []);
        }
    }




    return (
        <MaketProjectContext.Provider value={{

            projects: state.projects,
            projectsRequest: state.projectsRequest,
            message: state.message,
            projectId: state.projectId,
            stagesProject: state.stagesProject,
            filds: state.filds,
            objectImage: state.objectImage,
            currentStage: state.currentStage,
            stageRequest: state.stageRequest,
            fieldErrors: state.fieldErrors,
            getProjects,
            getProject,
            changeProjectField,
            nextStage,
            addProjectFile,
            removeProjectFile,
            clearMessage,
            fildIsVisible


        }}>{children}</MaketProjectContext.Provider>)

}