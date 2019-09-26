import { config } from './../../../constants/config';
import { getTests, removeTest, markTest } from './../websocketActions/tests';

export function requestClassTests(classId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(config.httpServerURL + '/class/' + classId + '/test', {
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
            dispatch(getTests(Response));
          } else {
            // Error
          }
        })
    }
  }
}

export function requestTeacherTests(teacherId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(config.httpServerURL + '/teacher/' + teacherId + '/test', {
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
            dispatch(getTests(Response));
          } else {
            // Error
          }
        })
    }
  }
}

export function requestRemoveClassTest(classId, testId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(config.httpServerURL + '/class/' + classId + '/test/' + testId, {
        method: 'DELETE',
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
            dispatch(removeTest(Response));
          } else {
            // Error
          }
        })
    }
  }
}

export function requestMarkTest(classId, newTest) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(config.httpServerURL + '/class/' + classId + '/test', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(newTest)
      })
        .then((Response) => {
          return Response.json();
        })
        .then((Response) => {
          if (Response && !Response.status) {
            dispatch(markTest(Response));
          } else {
            // Error
          }
        })
    }
  };
}

export function requestChildTests(studentId) {
  return (dispatch) => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + '/student/' + studentId + '/test', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: token
        },
      })
        .then((Response) => Response.json())
        .then((Response) => {
          if (Response && !Response.status) {
            dispatch(getTests(Response));
          } else {
            // ERROR
          }
        });
    }
  };
}