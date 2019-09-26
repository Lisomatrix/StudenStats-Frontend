import { config } from "./../../../constants/config";
import { getClasses } from "./../websocketActions/classes";
import {
  GET_STUDENT_CLASS,
  GET_COURSES,
  UPDATE_COURSE,
  ADD_CLASS,
  REMOVE_CLASS,
  UPDATE_CLASS,
  GET_STUDENT_PHOTO,
  REMOVE_STUDENT_FROM_CLASS,
  ADD_STUDENT_TO_CLASS,
  ADD_COURSE
} from "./../../../constants/action-types";
import { requestAdminStudents } from "./student";

export function requestGetClasses() {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/class", {
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
            dispatch(getClasses(Response));
            dispatch(requestStudentsPhotos(Response));

            return Response;
          } else {
            // ERROR
            return false;
          }
        });
    }
  };
}

export function requestStudentsPhotos(classes) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      for (var x = 0; x < classes.length; x++) {
        const aclass = classes[x];

        for (var i = 0; i < aclass.students.length; i++) {
          fetch(
            config.httpServerURL +
            "/student/" +
            aclass.students[i].studentId +
            "/photo",
            {
              method: "GET",
              headers: {
                Authorization: token
              }
            }
          )
            .then(Response => Response.blob())
            .then(Response => {
              const blob = new Blob([Response], { type: "image/png" });
              const imgUrl = URL.createObjectURL(blob);

              if (aclass.students[i]) {
                dispatch({
                  type: GET_STUDENT_PHOTO,
                  imgUrl: imgUrl,
                  studentId: aclass.students[i].studentId
                });
              }
            });
        }
      }
    }
  };
}

export function requestCourses() {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/admin/course", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        }
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch({
              type: GET_COURSES,
              payload: Response
            });
          } else {
            // ERROR
          }
        });
    }
  };
}

export function requestUpdateCourse(courseUpdate, courseId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/admin/course/" + courseId, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(courseUpdate)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch({
              type: UPDATE_COURSE,
              payload: Response
            });
            return true;
          } else {
            return false;
          }
        });
    }
  };
}
export function requestNewCourse(courseUpdate) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/admin/course", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(courseUpdate)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch({
              type: ADD_COURSE,
              payload: Response
            });
            return true;
          } else {
            return false;
          }
        });
    }
  };
}

export function requestAdminClasses() {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/admin/class", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        }
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch(getClasses(Response));
            return Response;
          } else {
            // ERROR
            return false;
          }
        });
    }
  };
}

export function requestAddStudentToClass(classId, studentUserId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(
        config.httpServerURL + "/class/" + classId + "/user/" + studentUserId,
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
            dispatch(getClasses(Response));
            return Response;
          } else {
            // ERROR
            return false;
          }
        });
    }
  };
}

export function requestAddStudentToClassByStudentId(classId, studentUserId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(
        config.httpServerURL +
        "/class/" +
        classId +
        "/student/" +
        studentUserId,
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
              type: ADD_STUDENT_TO_CLASS,
              payload: Response,
              studentId: studentUserId
            });
            return Response;
          } else {
            // ERROR
            return false;
          }
        });
    }
  };
}

export function requestRemoveStudentToClassByStudentId(classId, studentUserId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(
        config.httpServerURL +
        "/class/" +
        classId +
        "/student/" +
        studentUserId,
        {
          method: "DELETE",
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
              type: REMOVE_STUDENT_FROM_CLASS,
              payload: Response,
              studentId: studentUserId
            });
            dispatch(requestAdminStudents());
            return Response;
          } else {
            // ERROR
            return false;
          }
        });
    }
  };
}

export function requestStudentClass() {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(config.httpServerURL + "/student/class", {
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
              type: GET_STUDENT_CLASS,
              payload: Response
            });
          } else {
            // ERROR
          }
        });
    }
  };
}

export function requestChildClass(studentId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/student/" + studentId + "/class", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        }
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch({
              type: GET_STUDENT_CLASS,
              payload: Response
            });

            return Response;
          } else {
            // ERROR
          }
        });
    }
  };
}

export function requestNewClass(newClass) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/admin/class", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newClass)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch({
              type: ADD_CLASS,
              payload: Response
            });
            return true;
          } else {
            return false;
            // ERROR
          }
        });
    }
  };
}

export function requestRemoveClass(classId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/admin/class/" + classId, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        }
      }).then(Response => {
        if (Response.status === 200) {
          dispatch({
            type: REMOVE_CLASS,
            payload: classId
          });
          return true;
        } else {
          return false;
        }
      });
    }
  };
}

export function requestUpdateClass(newClass, classId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/admin/class/" + classId, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newClass)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch({
              type: UPDATE_CLASS,
              payload: Response
            });

            return Response;
          } else {
            return false;
            // ERROR
          }
        });
    }
  };
}
