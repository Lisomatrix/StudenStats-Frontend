import { config } from './../../../constants/config';
import { getStudents } from './../websocketActions/students';
import { GET_STUDENTS_WITHOUT_PARENT } from './../../../constants/action-types';

export function requestStudents(classId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(config.httpServerURL + '/class/' + classId + '/student', {
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
          if (Response) {
            {
              dispatch(getStudents(Response));
            }
          }
        })
    }
  }
}

export function requestStudentsWithoutParent() {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token) {
      return fetch(config.httpServerURL + '/admin/student/without/parent', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token
        }
      })
      .then((Response) => Response.json())
      .then((Response) => {
        if(Response && !Response.status) {
          dispatch({
            type: GET_STUDENTS_WITHOUT_PARENT,
            payload: Response
          });
          return true;
        } else {
          // ERROR
          return false;
        }
      })
    }
  }
}

export function requestAdminStudents() {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(config.httpServerURL + '/admin/student', {
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
          if (Response) {
            {
              dispatch(getStudents(Response));
            }
          }
        })
    }
  }
}
