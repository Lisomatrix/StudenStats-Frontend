import { config } from "./../../../constants/config";
import {
  GET_USER_EDIT_DATA,
  GET_USER_EDIT_PARENT_STUDENTS,
  GET_USER_EDIT_PARENT_STUDENTS_ADD,
  GET_USER_EDIT_PARENT_STUDENTS_REMOVE,
  ADD_STUDENTS_WITHOUT_PARENT,
  REMOVE_STUDENTS_WITHOUT_PARENT,
  GET_USER_EDIT_STUDENT_DATA,
  GET_USER_EDIT_STUDENT_PARENT,
  GET_USER_EDIT_TEACHER_DISCIPLINES
} from "./../../../constants/action-types";

export function requestUserEditAccount(userId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/admin/account/" + userId, {
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
              type: GET_USER_EDIT_DATA,
              payload: Response
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

export function requestUserEditStudentParent(studentId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if(token) {
      return fetch(config.httpServerURL + "/student/" + studentId +"/parent", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        }
      })
      .then((Response) => Response.json())
      .then((Response) => {
        if(Response && !Response.status) {
          dispatch({
            type: GET_USER_EDIT_STUDENT_PARENT,
            payload: Response
          })
        } else {
          return false;
        }
      });
    }
  }
}

export function requestUserEditStudent(userId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/" + userId +"/student", {
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
              type: GET_USER_EDIT_STUDENT_DATA,
              payload: Response
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

export function requestAdminParentChildren(parentUserId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(
        config.httpServerURL + "/parent/" + parentUserId + "/student",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        }
      )
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            const studentsLength = Response.length;
            const students = [];

            for (var i = 0; i < Response.length; i++) {
              dispatch(requestAdminParentChildrenPhotos(Response[i])).then(
                result => {
                  students.push(result);

                  if (students.length === studentsLength) {
                    dispatch({
                      type: GET_USER_EDIT_PARENT_STUDENTS,
                      payload: students
                    });
                  }
                }
              );
            }

            return true;
          } else {
            return false;
            // ERROR
          }
        });
    }
  };
}

export function requestAdminParentChildrenPhotos(student) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(
        config.httpServerURL + "/student/" + student.studentId + "/photo",
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

          if (imgUrl) {
            student.photo = imgUrl;
          } else {
            student.photo = "user";
          }

          return student;
        });
    }
  };
}

export function requestAddParentChild(parentUserId, studentUserId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(
        config.httpServerURL +
          "/parent/" +
          parentUserId +
          "/student/" +
          studentUserId,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        }
      )
        .then(Response => {
          return Response.json();
        })
        .then(Response => {
          if (Response && !Response.status) {
            dispatch(requestAdminParentChildrenPhotos(Response)).then(
              result => {
                dispatch({
                  type: GET_USER_EDIT_PARENT_STUDENTS_ADD,
                  payload: result
                });
              }
            );

              dispatch({
                  type: REMOVE_STUDENTS_WITHOUT_PARENT,
                  payload: studentUserId
              });

            return true;
          } else {
            var errorMessage = "";

            if (Response.message === "This student already has a parent!") {
              errorMessage = "Este aluno ja tem um encarregado de educação!";
            }

            return errorMessage;
          }
        });
    }
  };
}

export function requestRemoveParentChild(parentUserId, student) {
    return dispatch => {
      const token = localStorage.getItem("token");
  
      if (token) {
        return fetch(
          config.httpServerURL +
            "/parent/" +
            parentUserId +
            "/student/" +
            student.studentId,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: token
            }
          }
        )
          .then(Response => {
            if(Response.status === 200) {
                
                dispatch({
                    type: GET_USER_EDIT_PARENT_STUDENTS_REMOVE,
                    payload: student.studentId
                });

                dispatch({
                    type: ADD_STUDENTS_WITHOUT_PARENT,
                    payload: student
                });

                return true;
            } else {
                return false;
            }
          });
      }
    };
}

export function requestAdminTeacherDisciplines(teacherUserId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/" + teacherUserId +"/discipline", {
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
              type: GET_USER_EDIT_TEACHER_DISCIPLINES,
              payload: Response
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