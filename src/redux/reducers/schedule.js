import { GET_SCHEDULE, GET_DAYS, GET_HOURS } from './../../constants/action-types';

const schedules = (state= [], action) => {
    switch(action.type) {

        case GET_SCHEDULE:
            return Object.assign({}, state, {
                schedule: action.schedule
            });

        case GET_DAYS:
            return Object.assign({}, state, {
                days: action.days
            });

        case GET_HOURS:
            return Object.assign({}, state, {
                hours: action.hours
            });

        default:
            return state;
    }
}

export default schedules;