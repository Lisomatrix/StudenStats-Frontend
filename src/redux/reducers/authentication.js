import { LOGOUT, LOGIN_ERROR, LOGIN_SUCCESS, LOGIN_LOADING, GET_ROLES, GET_USER_PHOTO, GET_SELF_PHOTO } from './../../constants/action-types';

const authentication = (state = [], action) => {
	switch (action.type) {

		case GET_SELF_PHOTO: 
			return Object.assign({}, state, {
				userPhoto: action.payload
			});

		case LOGIN_SUCCESS:
			return Object.assign({}, state, {
				token: action.token,
				authorized: action.authorized,
				userId: action.userId,
				role: action.role,
				error: action.error,
				userRoleId: action.userRoleId,
				persistent: false,
				persistentRefreshed: true,
			});

		case LOGIN_ERROR:
			return Object.assign({}, state, {
				hasErrored: action.hasErrored,
				authorized: action.authorized,
				error: action.error
			});
		case LOGIN_LOADING:
			return Object.assign({}, state, {
				isLoading: action.isLoading
			});

		case LOGOUT:
			return Object.assign({}, state, {
				token: null,
				authorized: false,
				userId: null
			});

		case GET_ROLES:
			return Object.assign({}, state, {
				roles: action.payload
			});

		default:
			return state;
	}
};

export default authentication;
