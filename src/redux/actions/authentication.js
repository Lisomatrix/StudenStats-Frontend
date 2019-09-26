import { LOGOUT, LOGIN_ERROR, LOGIN_LOADING, LOGIN_SUCCESS } from './../../constants/action-types';
import rgba from 'rgba-convert';

import { config } from './../../constants/config';

export function logout() {
	return (dispatch) => {
		dispatch({
			type: LOGOUT,
			token: null,
			userId: null,
			authorized: false
		});
		localStorage.clear();
		window.less
			.modifyVars({
				'@btn-primary-bg': '#1890ff',
				'@bg-color': '#dddddd',
				'@layout-header-background': '#ffffff',
				'@secondary-color': '#dddddd',
				'@text-color-secondary': rgba.hex('rgba(0, 0, 0, .45)'),
				'@text-color': '#000000a6',
				'@card-background': '#f8f8f8',
				'@icon-color': '#000000a6'
			})
	};
}

export function loginError(error) {
	var err;


	if (typeof error === 'string' || error instanceof String) {
		err = error;
	} else {
		err = 'Erro ao tentar ligar ao servidor.';
	}

	return {
		type: LOGIN_ERROR,
		error: err,
		authorized: false
	};
}

export function loginIsLoading(isLoading) {
	return {
		type: LOGIN_LOADING,
		isLoading: isLoading
	};
}

export function loginPostDataSuccess(response) {
	return {
		type: LOGIN_SUCCESS,
		token: response.token,
		userId: response.userId,
		role: response.role,
		authorized: true,
		error: '',
		userRoleId: response.userRoleId
	};
}

export function rememberPostData() {
	return (dispatch) => {
		dispatch(loginIsLoading(true));

		fetch(config.httpServerURL + '/auth/token', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: localStorage.getItem('rememberToken')
			})
		})
			.then((response) => {
				dispatch(loginIsLoading(false));

				return response.json();
			})
			.then((response) => {

				if (response.redisToken.token) {
					dispatch(loginPostDataSuccess(response.redisToken));

					localStorage.setItem('token', response.redisToken.token);
					localStorage.setItem('rememberToken', response.permanentToken);

				} else if (!response.success) {
					// dispatch(loginError(response.message));
				}
			})
			.catch((err) => {
				// dispatch(loginIsLoading(false));
				dispatch(loginError(err));
			});
	}
}

export function authenticatePostData(values) {
	return (dispatch) => {

		fetch(config.httpServerURL + '/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: values.userName,
				password: values.password,
				remember: values.remember
			})
		})
			.then((response) => {
				dispatch(loginIsLoading(false));

				return response.json();
			})
			.then((response) => {

			});
	}
}

export function loginPostData(values) {
	return (dispatch) => {
		dispatch(loginIsLoading(true));

		fetch(config.httpServerURL + '/auth', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: values.userName,
				password: values.password,
				remember: values.remember
			})
		})
			.then((response) => {
				dispatch(loginIsLoading(false));

				return response.json();
			})
			.then((response) => {

				if (response.hasOwnProperty('token')) {
					dispatch(loginPostDataSuccess(response));
					localStorage.setItem('token', response.token);


				} else if (response.hasOwnProperty('redisToken')) {
					dispatch(loginPostDataSuccess(response.redisToken));

					localStorage.setItem('rememberToken', response.permanentToken);
					localStorage.setItem('token', response.redisToken.token);

				} else if (response.hasOwnProperty('success') && !response.success) {
					dispatch(loginError(response.message));
				}
			})
			.catch((err) => {
				dispatch(loginIsLoading(false));
				dispatch(loginError(err));
			});
	};
}
