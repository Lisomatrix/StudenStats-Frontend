import { config } from './../../../constants/config';
import { getDays, getHours, getSchedule } from './../websocketActions/schedules';

export function requestScheduleData() {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token) {
      fetch(config.httpServerURL + '/schedule', {
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
        if(Response && Response.scheduleDays && Response.hours) {
          dispatch(getDays(Response.scheduleDays))
          dispatch(getHours(Response.hours));
        } else {
          // Error
        }
      });
    }
  }
}

export function requestClassSchedule(classId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token) {
      fetch(config.httpServerURL + '/class/' + classId + '/schedule', {
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
        if(Response && Response.scheduleDays && Response.hours) {
          dispatch(getSchedule(Response));
        } else {
          // Error
        }
      });
    }
  }
}

export function requestTeacherSchedule(teacherId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token) {
      fetch(config.httpServerURL + '/teacher/' + teacherId + '/schedule', {
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
        
        if(Response && !Response.status) {
          dispatch(getSchedule(Response));
        } else {
          // Error
        }
      });
    }
  }
}