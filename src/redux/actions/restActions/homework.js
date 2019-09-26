import { config } from './../../../constants/config';
import { GET_HOMEWORK, MARK_HOMEWORK } from './../../../constants/action-types'

export function requestClassHomeWorks(classId) {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        if (token) {
            return fetch(config.httpServerURL + '/class/' + classId + '/homework', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            })
                .then((Response) => Response.json())
                .then((Response) => {
                    if (Response && !Response.status) {
                        dispatch({
                            type: GET_HOMEWORK,
                            homeworks: Response
                        });
                    } else {
                        // ERROR
                    }
                });
        }
    }
}

export function requestTeacherHomeWorks(teacherId) {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        if (token) {
            fetch(config.httpServerURL + '/teacher/' + teacherId + '/homework', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            })
                .then((Response) => Response.json())
                .then((Response) => {
                    if (Response && !Response.status) {
                        dispatch({
                            type: GET_HOMEWORK,
                            homeworks: Response
                        });
                    } else {
                        // ERROR
                    }
                })
        }
    }
}

export function requestMarkHomeWork(classId, homework) {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        if (token) {
            return fetch(config.httpServerURL + '/class/' + classId + '/homework', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify(homework)
            })
                .then((Response) => Response.json())
                .then((Response) => {
                    if (Response && !Response.status) {
                        dispatch({
                            type: MARK_HOMEWORK,
                            homeworks: Response
                        });
                    } else {
                        // ERROR
                    }
                })
        }
    }
}
