import { config } from "./../../../constants/config";
import {
  GET_DISCIPLINES,
  NEW_DISCIPLINE_TEACHER,
  REMOVE_DISCIPLINE_TEACHER,
  UPDATE_DISCIPLINE,
  ADD_DISCIPLINE
} from "./../../../constants/action-types";
import {
  getClassDisciplines,
  getTeacherDisciplines
} from "./../websocketActions/disciplines";

export function requestNewDisciplineTeacher(teacherUserId, disciplineId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(
        config.httpServerURL +
          "/user/" +
          teacherUserId +
          "/discipline/" +
          disciplineId,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token
          }
        }
      )
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch({
              type: NEW_DISCIPLINE_TEACHER,
              payload: Response
            });

            return true;
          } else {
            // ERROR
            return false;
          }
        });
    }
  };
}

export function requestRemoveDisciplineTeacher(teacherUserId, disciplineId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(
        config.httpServerURL +
          "/user/" +
          teacherUserId +
          "/discipline/" +
          disciplineId,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token
          }
        }
      ).then(Response => {
        if (Response.status === 200) {
          dispatch({
            type: REMOVE_DISCIPLINE_TEACHER,
            payload: {
              teacherUserId,
              disciplineId
            }
          });
          return true;
        } else {
          return false;
        }
      });
    }
  };
}

export function requestClassDisciplines(classId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/class/" + classId + "/discipline", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        }
      })
        .then(Response => {
          return Response.json();
        })
        .then(Response => {
          if (Response && !Response.status) {
            dispatch(getClassDisciplines(Response));

            return Response;
          } else {
            // Error
          }
        });
    }
  };
}

export function requestTeacherDisciplines() {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/teacher/discipline", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        }
      })
        .then(Response => {
          return Response.json();
        })
        .then(Response => {
          if (Response && !Response.status) {
            dispatch(getTeacherDisciplines(Response));
            return Response;
          } else {
            // Error
          }
        });
    }
  };
}

export function requestDisciplines() {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/discipline", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        }
      })
        .then(Response => {
          return Response.json();
        })
        .then(Response => {
          if (Response && !Response.status) {
            dispatch({
              type: GET_DISCIPLINES,
              payload: Response
            });
            return true;
          } else {
            return false;
            // Error
          }
        });
    }
  };
}

export function requestNewDiscipline(newDiscipline) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/discipline", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newDiscipline)
      })
        .then(Response => {
          return Response.json();
        })
        .then(Response => {
          if (Response && !Response.status) {
            dispatch({
              type: ADD_DISCIPLINE,
              payload: Response
            });
            return true;
          } else {
            return false;
            // Error
          }
        });
    }
  };
}

export function requestUpdateDiscipline(newDiscipline, disciplineId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/discipline/" + disciplineId, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newDiscipline)
      })
        .then(Response => {
          return Response.json();
        })
        .then(Response => {
          if (Response && !Response.status) {
            dispatch({
              type: UPDATE_DISCIPLINE,
              payload: Response
            });
            return true;
          } else {
            return false;
            // Error
          }
        });
    }
  };
}