import { CONNECTED, DISCONNECT, SET_STORAGE } from './../../constants/action-types';

const connect = (state = [], action) => {
	switch (action.type) {
		case CONNECTED:
			return Object.assign({}, state, {
				connected: true
			});

		case DISCONNECT:
			return Object.assign({}, state, {
				disconnected: true,
				connected: false
			});
			
		case SET_STORAGE: {
			return Object.assign({}, state, {
				storageReady: action.storageReady,
				user: action.user
			});
		}

		default:
			return state;
	}
};

export default connect;
