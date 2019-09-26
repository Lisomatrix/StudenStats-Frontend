import { config } from './../../../constants/config';
import { GET_TEACHER, GET_FREE_TEACHERS, GET_DIRECTOR_TEACHERS, SET_DIRECTOR_TEACHER, SET_FREE_TEACHER } from './../../../constants/action-types';

export function requestAdminTeachers() {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        if (token) {
            return fetch(config.httpServerURL + '/admin/teacher', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: token
                },
            })
                .then((Response) => {
                    return Response.json();
                })
                .then((Response) => {
                    if (Response && !Response.status) {
                        {
                            dispatch(getTeachers(Response));
                        }
                    }
                })
        }
    }
}

export function requestFreeTeachers() {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        if (token) {
            return fetch(config.httpServerURL + '/admin/teacher/free', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: token
                },
            })
                .then((Response) => {
                    return Response.json();
                })
                .then((Response) => {
                    if (Response && !Response.status) {
                        {
                            dispatch(getFreeTeachers(Response));
                        }
                    }
                })
        }
    }
}

export function requestDirectorTeachers() {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        if (token) {
            return fetch(config.httpServerURL + '/admin/teacher/director', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: token
                },
            })
                .then((Response) => {
                    return Response.json();
                })
                .then((Response) => {
                    if (Response && !Response.status) {
                        {
                            dispatch(getDirectorTeachers(Response));
                        }
                    }
                })
        }
    }
}

export function addDirectorTeacher(data) {
    return {
        type: SET_DIRECTOR_TEACHER,
        payload: data
    };
}

export function addFreeTeacher(data) {
    return {
        type: SET_FREE_TEACHER,
        payload: data
    };
}

function getDirectorTeachers(data) {
    return {
        type: GET_DIRECTOR_TEACHERS,
        payload: data
    }
}

function getFreeTeachers(data) {
    return {
        type: GET_FREE_TEACHERS,
        payload: data
    }
}

function getTeachers(data) {
    return {
        type: GET_TEACHER,
        payload: data
    }
}