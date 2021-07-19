import { v4 as uuidv4 } from 'uuid';

export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}


export const getBase64 = (file) => {
    return new Promise(resolve => {

        let baseURL = "";
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            baseURL = reader.result.split(',')[1];
            resolve(baseURL);

        };

    });
};

export const createMessage = (type, str, clearMessage, lifetime=0) => {
    const uid = uuidv4();
    if (lifetime) {
        setTimeout(() => clearMessage(uid), lifetime)
    }
    return { type, str, uid, clearMessage}
}

export const alertTypes = { error: 'error', warning: 'warning', info: 'info', success: 'success' };

