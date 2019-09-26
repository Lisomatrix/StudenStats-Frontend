import { CONNECTED, SET_STORAGE } from './../../../constants/action-types';

export function connected(connected) {
	return {
		type: CONNECTED,
		connected: connected
	};
}

export function setStorage(data) {
	return {
		type: SET_STORAGE,
		storageReady: true,
		user: data
	};
}
