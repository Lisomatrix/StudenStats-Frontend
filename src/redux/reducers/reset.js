import { RESET_GET_SUCCESS, RESET_POST_SUCCESS, RESET_LOADING, RESET_ERROR } from './../../constants/action-types';

const reset = (state = [], action) => {
	switch (action.type) {
		case RESET_GET_SUCCESS:
			return Object.assign({}, state, {
				resetId: action.resetId,
				getSuccess: action.getSuccess,
				error: action.error
			});
		case RESET_POST_SUCCESS:
			return Object.assign({}, state, {
				postSuccess: action.postSuccess,
				error: action.error
			});
		case RESET_LOADING:
			return Object.assign({}, state, {
				isLoading: action.isLoading
			});
		case RESET_ERROR:
			return Object.assign({}, state, {
				error: action.error
			});
		default:
			return state;
	}
};

export default reset;
