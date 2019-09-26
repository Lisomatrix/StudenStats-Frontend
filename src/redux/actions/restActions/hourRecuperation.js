import { config } from './../../../constants/config';
import {  } from './../websocketActions/absences';

export function requestClassModuleGrades(recuperateAbsence) {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if(token){
      fetch(config.httpServerURL + '/recuperation/absence', {
        method: 'POST',
        headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
        },
        body: JSON.stringify(recuperateAbsence)
      })
      .then((Response) => {
        return Response.json();
      })
      .then((Response) => {
        if(Response && Response.status === 200) {
          dispatch(getGrades(Response));
        } else {
          // Error
        }
      });
    }
  };
}
