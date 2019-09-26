import { REGISTER_ERROR, REGISTER_SUCCESS, REGISTER_LOADING } from './../../constants/action-types';

import { config } from './../../constants/config';

export function registerError(error) {
	var err;

	if (typeof error === 'string' || error instanceof String) {
		err = error;
	} else {
		err = 'Erro ao tentar ligar ao servidor.';
	}

	return {
		type: REGISTER_ERROR,
		hasErrored: true,
		error: err
	};
}

export function registerIsLoading(isLoading) {
	return {
		type: REGISTER_LOADING,
		isLoading: isLoading
	};
}

export function registerPostDataSuccess(response) {
	return {
		type: REGISTER_SUCCESS,
		success: response.success,
		error: ''
	};
}

export function registerPostData(values) {
	return (dispatch) => {
		dispatch(registerIsLoading(true));

		fetch(config.httpServerURL + '/register', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: values.email,
				password: values.password,
				registrationCode: values.registrationCode
			})
		})
			.then((response) => {
				dispatch(registerIsLoading(false));

				return response.json();
			})
			.then((response) => {
				if (response.success) {
					dispatch(registerPostDataSuccess(response));
				} else {
					dispatch(registerError(response.message));
				}
			})
			.catch((err) => {
				dispatch(registerIsLoading(false));
				dispatch(registerError(err));
			});
	};
}
