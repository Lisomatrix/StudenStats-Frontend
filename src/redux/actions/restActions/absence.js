import { config } from './../../../constants/config';
import {
	getClassAbsences,
	MarkAbsence,
	RemoveAbsence,
	JustifyAbsence,
	getAbsenceTypes,
	getAbsences
} from './../websocketActions/absences';
import { RECUPERATE_ABSENCE } from './../../../constants/action-types'


export function requestClassAbsences() {
	return (dispatch) => {
		const token = localStorage.getItem('token');

		if (token) {
			fetch(config.httpServerURL + '/class/absence', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
				}
			})
				.then((Response) => {
					return Response.json();
				})
				.then((Response) => {
					if (Response && !Response.status) {
						dispatch(getClassAbsences(Response));
					} else {
						// ERROR
					}
				});
		}
	};
}

export function requestRecuperateAbsence(absenceId, recuperate) {
	return (dispatch) => {
		const token = localStorage.getItem('token');

		if(token) {
			fetch(config.httpServerURL + '/absence/' + absenceId + '/recuperate', {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
				},
				body: JSON.stringify({
					absenceId: absenceId,
					recuperated: recuperate
				})
			})
			.then((Response) => Response.json())
			.then((Response) => {
				if (Response && !Response.status) {
					dispatch(recuperateAbsence(Response))
				} else {
					// ERROR
				}
			})
		}
	}
}

export function requestJustifyAbsence(absenceId) {
	return (dispatch) => {
		const token = localStorage.getItem('token');

		if (token) {
			fetch(config.httpServerURL + '/absence/' + absenceId, {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
				}
			})
				.then((Response) => {
					return Response.json();
				})
				.then((Response) => {
					
					if (Response && !Response.status) {
						dispatch(JustifyAbsence(Response));
					} else {
						// ERROR
					}
				});
		}
	};
}

export function requestMarkAbsence(markAbsence) {
	return (dispatch) => {
		const token = localStorage.getItem('token');

		if (token) {
			fetch(config.httpServerURL + '/absence', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
				},
				body: JSON.stringify(markAbsence)
			})
				.then((Response) => {
					return Response.json();
				})
				.then((Response) => {
					if (Response && !Response.status) {
						dispatch(MarkAbsence(Response));
					} else {
						// ERROR
					}
				});
		}
	};
}

export function requestRemoveAbsence(absenceId) {
	return (dispatch) => {
		const token = localStorage.getItem('token');

		if (token) {
			fetch(config.httpServerURL + '/absence/' + absenceId, {
				method: 'DELETE',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
				}
			})
				.then((Response) => {
					return Response.json();
				})
				.then((Response) => {
					if (Response && !Response.status) {
						dispatch(RemoveAbsence(Response));
					} else {
						// Error
					}
				});
		}
	};
}

export function requestAbsenceTypes() {
	return (dispatch) => {
		const token = localStorage.getItem('token');

		if (token) {
			fetch(config.httpServerURL + '/absence/types', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
				}
			})
				.then((Response) => {
					return Response.json();
				})
				.then((Response) => {
					if (Response) {
						dispatch(getAbsenceTypes(Response));
					} else {
						// Error
					}
				});
		}
	};
}

export function requestStudentAbsences() {
	return (dispatch) => {
		const token = localStorage.getItem('token');

		if (token) {
			fetch(config.httpServerURL + '/student/absence', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
				}
			})
				.then((Response) => {
					return Response.json();
				})
				.then((Response) => {
					if (Response && !Response.status) {
						dispatch(getAbsences(Response));
					} else {
						// Error
					}
				});
		}
	};
}

export function requestParentAbsences() {
	return (dispatch) => {
		const token = localStorage.getItem('token');

		if (token) {
			fetch(config.httpServerURL + '/parent/absence', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
				}
			})
				.then((Response) => {
					return Response.json();
				})
				.then((Response) => {
					if (Response && !Response.status) {
						dispatch(getAbsences(Response));
					} else {
						// Error
					}
				});
		}
	};
}

export function requestLessonAbsences(lessonId) {
	return (dispatch) => {
		const token = localStorage.getItem('token');

		if (token) {
			fetch(config.httpServerURL + '/lesson/' + lessonId + '/absence', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
				}
			})
				.then((Response) => {
					return Response.json();
				})
				.then((Response) => {
					if (Response && !Response.status) {
						dispatch(getAbsences(Response));
					} else {
						// Error
					}
				});
		}
	};
}

function recuperateAbsence(data) {
	return {
		type: RECUPERATE_ABSENCE,
		payload: data
	}
}