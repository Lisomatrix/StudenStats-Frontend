import { config } from './../../../constants/config';
import { SEND_MESSAGE } from './../../../constants/action-types';

export function requestNewMessage(classId, message) {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        if (token) {
            return fetch(config.httpServerURL + '/class/' + classId + '/message', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify(message)
            })
                //.then((Response) => Response.json())
                .then((Response) => {
                    console.log(Response);
                    dispatch({
                        type: SEND_MESSAGE
                    });
                    // if (Response && !Response.status) {
                    //     dispatch({
                    //         type: SEND_MESSAGE
                    //     });
                    // } else {
                    //     // ERROR
                    // }
                })
        }
    }
}