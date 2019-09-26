import { config } from './../../../constants/config';
import { newModule, getModules } from './../websocketActions/modules';
import { UPDATE_MODULE } from './../../../constants/action-types';

export function requestNewModule(module) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token){
      return fetch(config.httpServerURL + '/module', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
        },
        body: JSON.stringify(module)
      })
      .then((Response) => {
        return Response.json();
      })
      .then((Response) => {
        if(Response && !Response.status) {
          dispatch(newModule(Response));
          return Response;
        } else {
          // Error
          return false;
        }
      });
    }
  };
}

export function requestUpdateModule(module, moduleId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token){
      return fetch(config.httpServerURL + '/module/' + moduleId, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
        },
        body: JSON.stringify(module)
      })
      .then((Response) => {
        return Response.json();
      })
      .then((Response) => {
        if(Response && !Response.status) {
          dispatch({
            type: UPDATE_MODULE,
            payload: Response
          });
          return Response;
        } else {
          // Error
          return false;
        }
      });
    }
  };
}

export function requestModules() {
  return dispatch => {
    const token = localStorage.getItem('token');

    if(token){
      return fetch(config.httpServerURL + '/module', {
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
          dispatch(getModules(Response));
        } else {
          // Error
        }
      });
    }
  }
}

export function requestModulesByDescipline(disciplineId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token){
      return fetch(config.httpServerURL + '/discipline/' + disciplineId + '/module', {
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
          dispatch(getModules(Response));
        } else {
          // Error
        }
      });
    }
  };
}

export function requestModulesByClass(classId) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token){
      fetch(config.httpServerURL + '/class/' + classId + '/module', {
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
          dispatch(getModules(Response));
        } else {
          // Error
        }
      });
    }
  };
}
