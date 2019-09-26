import { config } from './../../../constants/config';
import { getLessons, updateSummary, newLesson, newLessonComplete } from './../websocketActions/lesson';

export function requestLessonSummaryUpdate(updateLessonSummary) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token){
      return fetch(config.httpServerURL + '/lesson', {
        method: 'PUT',
        headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
        },
        body: JSON.stringify(updateLessonSummary)
      })
      .then((Response) => {
        return Response.json();
      })
      .then((Response) => {
        if(Response && !Response.status) {
          dispatch(updateSummary(Response));
        } else {
          // Error
        }

        return Response;
      });
    }
  };
}

export function requestNewLesson(addLesson) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token) {
      return fetch(config.httpServerURL + '/lesson', {
        method: 'POST',
        headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
        },
        body: JSON.stringify(addLesson)
      })
      .then((Response) => {
        return Response.json();
      })
      .then((Response) => {
        if(Response && !Response.status) {
          dispatch(newLesson(Response));
          dispatch(newLessonComplete());
        } else {
          // Error
        }

        return Response;
      });
    }
  };
}

export function requestClassLessons(classId, disciplineId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token){
      fetch(config.httpServerURL + '/class/' + classId + '/discipline/' + disciplineId + '/lesson', {
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
        if(Response && !Response.status) {
          dispatch(getLessons(Response));
        } else {
          // Error
        }
      });
    }
  };
}