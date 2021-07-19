import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './Editor.css'

const HTMLEditor = (props) => {

  

    return (<Editor editorClassName="editor"
        editorState={props.editorState}
        onEditorStateChange={props.setEditorState}
        id = {props.id}
    />)
}
export default HTMLEditor;


