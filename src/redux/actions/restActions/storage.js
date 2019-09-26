import { config } from './../../../constants/config';
import { GET_USER_FILES, DELETE_USER_FILE, ADD_USER_FILE, GET_STORAGE_SERVERS, GET_STORAGE_ALIVE, ADD_STORAGE_SERVER, REMOVE_STORAGE_SERVER } from './../../../constants/action-types';
import download from 'downloadjs';

export function requestFileDownload(fileId, fileName) {
    return (dispatch) => {

        const token = localStorage.getItem('token');

        if(token) {
            return fetch(config.httpServerURL + '/file/' + fileId, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
					Authorization: token
                }
            })
            .then((Response) => {
                if(Response.status !== 500) {
                    return Response.blob();
                } else {
                    throw { Response };
                }
            })
            .then((Response) => {
                download(Response, fileName);
            })
            .catch(x => {
                return false;
            });

        }
    };
}

export function requestUserFiles(userId) {
    return (dispatch) => {

        const token = localStorage.getItem('token');

        if(token) {
            fetch(config.httpServerURL + '/user/' + userId + '/file', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
					Authorization: token
                }
            })
            .then((Response) => Response.json())
            .then((Response) => {
                
                if(Response) {
                    dispatch(getUserFiles(Response));
                } else {
                    // ERROR
                }
            })
            .catch(x => console.log(x));

        }
    };
}

export function requestFileDelete(fileId) {
    return (dispatch) => {

        const token = localStorage.getItem('token');

        if(token) {
            return fetch(config.httpServerURL + '/user/file/' + fileId, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
					Authorization: token
                }
            })
            .then((Response) => {

                if(Response.status === 200) {
                    dispatch(deleteFile(fileId));
                }

                return Response.status;
            })

        }
    };
}

export function requestStorageServers() {
    return(dispatch) => {

        const token = localStorage.getItem('token');

        if(token) {
            return fetch(config.httpServerURL + "/storage", {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
					Authorization: token
                }
            })
            .then((Response) => Response.json())
            .then((Response) => {
                if(Response && !Response.status) {
                    dispatch(getStorageServers(Response));
                } else {
                    // ERROR
                }
            });
        }
    }
}

export function requestStorageIsAlive(storageId) {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        if(token) {
            return fetch(config.httpServerURL + "/storage/" + storageId + "/alive", {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
					Authorization: token
                }
            })
            .then((Response) => Response.json())
            .then((Response) => {
                if(Response && !Response.status) {
                    dispatch(getStorageAlive({
                        alive: Response.alive,
                        storageId: storageId
                    }));
                } else {
                    // ERROR
                }
            });
        }
    }
}

export function requestRemoveStorageServer(storageId) {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        if(token) {
            return fetch(config.httpServerURL + "/storage/" + storageId, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
					Authorization: token
                },
            })
            .then((Response) => {
                if(Response.status === 200) {
                    dispatch(removeStorage(storageId));
                    return true;
                }

                return false;
            });
        }
    }
}

export function requestNewStorageServer(storage) {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        if(token) {
            return fetch(config.httpServerURL + "/config/storage", {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    Accept: 'application/json',
					Authorization: token
                },
                body: JSON.stringify(storage)
            })
            .then((Response) => Response.json())
            .then((Response) => {
                if(Response && !Response.status) {
                    dispatch(addStorage(Response));
                    return true;
                } else {
                    return false;
                    // ERROR
                }
            })
        }
    };
}

export function requestAddFile(data) {
    return (dispatch) => {
        dispatch(addFile(data));
    };
}

function removeStorage(storageId) {
    return {
        type: REMOVE_STORAGE_SERVER,
        payload: storageId
    }
}

function addStorage(data) {
    return {
        type: ADD_STORAGE_SERVER,
        payload: data
    };
}

function getStorageAlive(data) {
    return {
        type: GET_STORAGE_ALIVE,
        payload: data
    }
}

function getStorageServers(data) {
    return {
        type: GET_STORAGE_SERVERS,
        payload: data
    }
}

function addFile(data) {
    return {
        type: ADD_USER_FILE,
        payload: data
    }
}

function deleteFile(data) {
    return {
        type: DELETE_USER_FILE,
        payload: data
    }
}

function getUserFiles(data) {
    return {
        type: GET_USER_FILES,
        payload: data
    };
}