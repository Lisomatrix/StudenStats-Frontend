import { RESET_ERROR, RESET_GET_SUCCESS, RESET_POST_SUCCESS, RESET_LOADING } from './../../constants/action-types';

import { config } from './../../constants/config';

export function resetError(error) {
	var err;

	if (typeof error === 'string' || error instanceof String) {
		err = error;
	} else {
		err = 'Erro ao tentar ligar ao servidor.';
	}

	return {
		type: RESET_ERROR,
		error: err
	};
}

export function resetIsLoading(isLoading) {
	return {
		type: RESET_LOADING,
		isLoading: isLoading
	};
}

export function resetPostDataSuccess(response) {
	return {
		type: RESET_POST_SUCCESS,
		postSuccess: true,
		error: ''
	};
}

export function resetGetDataSuccess(response) {
	return {
		type: RESET_GET_SUCCESS,
		resetId: response.message,
		getSuccess: true,
		error: ''
	};
}

export function resetGetData(email) {
	return (dispatch) => {
		dispatch(resetIsLoading(true));

		fetch(config.httpServerURL + '/reset/' + email, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				dispatch(resetIsLoading(false));

				return response.json();
			})
			.then((response) => {
				if (response.success) {
					dispatch(resetGetDataSuccess(response));
				} else {
					dispatch(resetError(response.message));
				}
			})
			.catch((err) => {
				dispatch(resetIsLoading(false));
				dispatch(resetError(err));
			});
	};
}

export function resetPostData(values) {
	return (dispatch) => {
		dispatch(resetIsLoading(true));

		return fetch(config.httpServerURL + '/reset', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				resetCode: values.resetCode,
				resetId: values.resetId,
				password: values.password
			})
		})
			.then((response) => {
				dispatch(resetIsLoading(false));

				return response.json();
			})
			.then((response) => {
				if (response.success) {
					dispatch(resetPostDataSuccess(response));
					return true;
				} else {
					dispatch(resetError(response.message));
					return false;
				}
			})
			.catch((err) => {
				dispatch(resetIsLoading(false));
				dispatch(resetError(err));
			});
	};
}
