import { REGISTER_ERROR, REGISTER_SUCCESS, REGISTER_LOADING } from './../../constants/action-types';

const register = (state = [], action) => {
	switch (action.type) {
		case REGISTER_SUCCESS:
			return Object.assign({}, state, {
				success: action.success,
				error: action.error
			});

		case REGISTER_ERROR:
			return Object.assign({}, state, {
				hasErrored: action.hasErrored,
				error: action.error
			});

		case REGISTER_LOADING:
			return Object.assign({}, state, {
				isLoading: action.isLoading
			});

		default:
			return state;
	}
};

export default register;
