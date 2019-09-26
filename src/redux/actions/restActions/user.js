import { config } from "./../../../constants/config";
import {
  GET_ROLES,
  GET_ACCOUNTS,
  GET_ACCOUNT,
  DELETE_ACCOUNT,
  GET_USER_PHOTO,
  GET_SELF_PHOTO
} from "./../../../constants/action-types";
import { setStorage } from "./../websocketActions/connect";
import { setTheme } from "./../theme";

export function requestSelfPhoto(userId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/" + userId + "/photo", {
        method: "GET",
        headers: {
          Authorization: token
        }
      })
        .then(Response => {
          return Response.blob();
        })
        .then(Response => {
          const blob = new Blob([Response], { type: "image/png" });
          const imgUrl = URL.createObjectURL(blob);

          dispatch({
            type: GET_SELF_PHOTO,
            payload: imgUrl
          });
        });
    }
  };
}

export function requestUserPhoto(userId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/" + userId + "/photo", {
        method: "GET",
        headers: {
          Authorization: token
        }
      })
        .then(Response => {
          return Response.blob();
        })
        .then(Response => {
          const blob = new Blob([Response], { type: "image/png" });
          const imgUrl = URL.createObjectURL(blob);

          dispatch({
            type: GET_USER_PHOTO,
            payload: {
              imgUrl: imgUrl,
              userId: userId
            }
          });
        });
    }
  };
}

export function requestUserEditPhoto(userId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/" + userId + "/photo", {
        method: "GET",
        headers: {
          Authorization: token
        }
      })
        .then(Response => {
          if (Response.status === 200) {
            return Response.blob();
          }

          return false;
        })
        .then(Response => {
          if (Response) {
            const blob = new Blob([Response], { type: "image/png" });
            const imgUrl = URL.createObjectURL(blob);

            return imgUrl;
          }

          return false;
        });
    }
  };
}

export function requestUserData() {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(config.httpServerURL + "/user", {
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
          if (Response) {
            const currentTheme = JSON.parse(Response.userThemeSettings);
            currentTheme.dark = currentTheme.dark ? "dark" : "light";

            dispatch(setTheme(currentTheme));
            dispatch(setStorage(Response));
          }
        });
    }
  };
}

export function requestUserThemeUpdate(theme) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(config.httpServerURL + "/user/theme", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(theme)
      })
        .then(Response => {
          return Response.json();
        })
        .then(Response => {
          if (Response && !Response.status) {
            const currentTheme = Response;
            currentTheme.dark = currentTheme.dark ? "dark" : "light";

            dispatch(setTheme(currentTheme));
          }
        });
    }
  };
}

export function requestUserRoles() {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/role", {
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
              type: GET_ROLES,
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

export function requestNewStudent(newStudent) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/student", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newStudent)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch(requestAccount(Response.userId));
            return true;
          } else {
            return false;
          }
        });
    }
  };
}

export function requestUpdateStudent(newStudent, userId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/" + userId + "/student", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newStudent)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch(requestAccount(Response.userId));
            return true;
          } else {
            return false;
          }
        });
    }
  };
}

export function requestNewTeacher(newTeacher) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/teacher", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newTeacher)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch(requestAccount(Response.userId));
            return true;
          } else {
            return false;
          }
        });
    }
  };
}

export function requestUpdateTeacher(newTeacher, userId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/" + userId + "/teacher", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newTeacher)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch(requestAccount(Response.userId));
            return true;
          } else {
            return false;
          }
        });
    }
  };
}

export function requestNewParent(newParent) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/parent", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newParent)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            return true;
          } else {
            return false;
          }
        });
    }
  };
}

export function requestUpdateParent(newParent, userId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/" + userId + "/parent", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newParent)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            return true;
          } else {
            return false;
          }
        });
    }
  };
}

export function requestNewAdmin(newAdmin) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/admin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newAdmin)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch(requestAccount(Response.userId));
            return true;
          } else {
            return false;
          }
        });
    }
  };
}

export function requestUpdateAdmin(newAdmin, userId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/user/" + userId + "/admin", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newAdmin)
      })
        .then(Response => Response.json())
        .then(Response => {
          if (Response && !Response.status) {
            dispatch(requestAccount(Response.userId));
            return true;
          } else {
            return false;
          }
        });
    }
  };
}

export function requestDeleteUser(userId) {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/admin/user/" + userId, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token
        }
      }).then(Response => {
        if (Response.status === 200) {
          dispatch({
            type: DELETE_ACCOUNT,
            payload: userId
          });
          return true;
        } else {
          return false;
        }
      });
    }
  };
}

export function requestAccounts() {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (token) {
      return fetch(config.httpServerURL + "/admin/account", {
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
              type: GET_ACCOUNTS,
              payload: Response
            });
          } else {
            // ERROR
          }
        });
    }
  };
}

export function requestAccount(userId) {
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
              type: GET_ACCOUNT,
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
