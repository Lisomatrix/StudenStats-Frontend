import { GET_USER_FILES, DELETE_USER_FILE, ADD_USER_FILE, GET_STORAGE_SERVERS, GET_STORAGE_ALIVE, ADD_STORAGE_SERVER, REMOVE_STORAGE_SERVER } from './../../constants/action-types';

const storage = (state = [], action) => {
    switch (action.type) {

        case GET_STORAGE_ALIVE: {

            const storages = [];

            for(var i = 0; i < state.storages.length; i++) {
                if(state.storages[i].storageId === action.payload.storageId) {
                    state.storages[i].status = action.payload.alive;
                    state.storages[i].online = action.payload.alive;
                    state.storages[i].statusFetched = true;
                }

                storages.push(state.storages[i]);
            }

            return Object.assign({}, state, {
                storages: storages
            });
        }

        case GET_STORAGE_SERVERS:
            return Object.assign({}, state, {
                storages: action.payload
            });

        case ADD_STORAGE_SERVER: {
            var storageServers = [];

            if(state.storages) {
              //storageServers = state.storages;
              storageServers = JSON.parse(JSON.stringify(state.storages));
            }

            storageServers.push(action.payload);

            return Object.assign({}, state, {
                storages: storageServers
            });
        }

        case REMOVE_STORAGE_SERVER: {
            const storageServers = [];

            for(var i = 0; i < state.storages.length; i++) {
                if(state.storages[i].storageId !== action.payload) {
                    storageServers.push(state.storages[i]);
                }
            }

            return Object.assign({}, state, {
                storages: storageServers
            });
        }

        case GET_USER_FILES: {

            action.payload.forEach(file => {
                
                file.fileName = file.fileName.split("--").pop();
            });

            return Object.assign({}, state, {
                files: action.payload
            });
        }

        case DELETE_USER_FILE: {

            var newFiles = [];

            if(state.files) {
                for(var i = 0; i < state.files.length; i++) {
                    if(state.files[i].fileId !== action.payload) {
                        newFiles.push(state.files[i]);
                    }
                }
            }

            return Object.assign({}, state, {
                files: newFiles
            });
        }

        case ADD_USER_FILE: {

            action.payload.fileName = action.payload.fileName.split("--").pop();

            var files = [];

            if(state.files) {
                files = state.files;
            }

            files.push(action.payload);

            return Object.assign({}, state, {
                files: files
            })
        }

        default:
            return state;
    }
}

export default storage;