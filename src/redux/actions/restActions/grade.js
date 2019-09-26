import { config } from './../../../constants/config';
import { getGrades } from './../websocketActions/grades';
import { getModuleGrades } from './../websocketActions/modules';
import { GET_TEST_GRADES, UPDATE_TEST_GRADES, UPDATE_MODULES_GRADE } from './../../../constants/action-types';

export function requestClassModuleGrades(classId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token){
      return fetch(config.httpServerURL + '/class/' + classId + '/module/grade', {
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
          dispatch(getModuleGrades(Response));
        } else {
          // Error
          dispatch(notFoundTestGrades());
        }
      });
    }
  };
}

export function requestUpdateModuleGrades(grades, moduleId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token) {
      return fetch(config.httpServerURL + '/module/' + moduleId + '/grade', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(grades)
      })
      .then((Response) => Response.json())
      .then((Response) => {
        if(Response && !Response.status) {
          dispatch({
            type: UPDATE_MODULES_GRADE,
            payload: Response
          });
        }
      });
    }
  }
}

export function requestClassAndModuleTestGrades(classId, moduleId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token)
    return fetch(config.httpServerURL + '/class/' + classId + '/module/' + moduleId + '/grade', {
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
        dispatch(getTestGrades(Response));
      } else {
        // ERROR
        dispatch(notFoundTestGrades());
      }
    });
  }
}

export function requestTestGrades(testId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token)
    return fetch(config.httpServerURL + '/test/' + testId + '/grade', {
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
        dispatch(getTestGrades(Response));
      } else {
        // ERROR
        dispatch(notFoundTestGrades());
      }
    });
  };
}

export function requestUpdateTestGrades(grades, testId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token) {
      return fetch(config.httpServerURL + '/test/' + testId + '/grade', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(grades)
      })
      .then((Response) => Response.json())
      .then((Response) => {
        if(Response && !Response.status) {
          dispatch(updateTestGrades(Response));
        } else {
          // ERROR
          dispatch(notFoundTestGrades());
        }
      });
    }
  };
}

export function requestStudentTestGrades() {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token)
    return fetch(config.httpServerURL + '/student/grade', {
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
        dispatch(getTestGrades(Response));
      } else {
        // ERROR
        dispatch(notFoundTestGrades());
      }
    });
  };
}

export function requestStudentModuleGrades() {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token){
      return fetch(config.httpServerURL + '/student/module/grade', {
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
          dispatch(getModuleGrades(Response));
        } else {
          // Error
        }
      });
    }
  };
}

export function requestChildModuleGrades(studentId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token) {
      fetch(config.httpServerURL + '/student/' + studentId + '/module/grade', {
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
          dispatch(getModuleGrades(Response));
        } else {
          // ERROR
        }
      });
    }
  }
}

export function requestChildTestGrades(studentId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token) {
      return fetch(config.httpServerURL + '/student/' + studentId + '/test/grade', {
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
          dispatch(getTestGrades(Response));
        } else {
          // ERROR
        }
      });
    }
  };
}

function updateTestGrades(data) {
  return {
    type: UPDATE_TEST_GRADES,
    payload: data
  }
}

function getTestGrades(data) {
  return {
    type: GET_TEST_GRADES,
    payload: data
  }
}

function notFoundTestGrades() {
  return {
    type: 'NOT_FOUND',
    payload: null
  }
}