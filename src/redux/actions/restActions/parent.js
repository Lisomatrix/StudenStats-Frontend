import { config } from './../../../constants/config';
import { GET_PARENT_STUDENT } from './../../../constants/action-types';

export function requestParentChildren() {
    return (dispatch) => {
        const token = localStorage.getItem("token");

        if(token) {
            return fetch(config.httpServerURL + '/parent/student', {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                            Authorization: token
                },
            })
            .then((Response) => Response.json())
            .then((Response) => {
                if(Response && !Response.status) {
                    dispatch({
                        type: GET_PARENT_STUDENT,
                        payload: Response
                    });
                } else {
                    // ERROR
                }
            });
        }
    };
}