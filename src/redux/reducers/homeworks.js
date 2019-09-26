import { GET_HOMEWORK, MARK_HOMEWORK } from './../../constants/action-types';

const homeworks = (state = [], action) => {
    switch (action.type) {

        case GET_HOMEWORK: {
            var homeworks = [];

            const newHomeworks = action.homeworks.map((item) => {
                item = addDayandDate(item);

                return item;
            })

            if(state.homeworks) {
                //homeworks = state.homeworks;
                homeworks = JSON.parse(JSON.stringify(state.homeworks));

                for(var i = 0; i < newHomeworks.length; i++) {
                    homeworks.push(newHomeworks[i]);
                }
            } else {
                homeworks = newHomeworks;
            }

            return Object.assign({}, state, {
                homeworks: homeworks
            });
        }

        case MARK_HOMEWORK: {

            var homeworks = [];

            const newHomework = addDayandDate(action.homeworks);

            homeworks.push(newHomework);

            if(state.homeworks) {
                homeworks = state.homeworks.concat(homeworks);
            } 

            return Object.assign({}, state, {
                homeworks: homeworks
            });
        }

        default:
            return state;
    }
}

function addDayandDate(test) {
	const dateAndTime = formatDate(test.expireDate + '');

	test.date = dateAndTime.date.replace(/-/g, "/");

	return test;
}

function formatDate(timeStamp) {
	const date = timeStamp.substring(0, 10);
	const time = timeStamp.substring(16, 11);

	return { date, time };
}


export default homeworks;