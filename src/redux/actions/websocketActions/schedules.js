import { GET_SCHEDULE, GET_DAYS, GET_HOURS } from './../../../constants/action-types';
import moment from 'moment';

export function getSchedule(schedule) {
    return {
        type: GET_SCHEDULE,
        schedule: schedule
    };
}

export function getDays(days) {
    return {
        type: GET_DAYS,
        days: days
    };
}

export function getHours(hours) {

    const orderedHours = orderHours(hours);

    return {
        type: GET_HOURS,
        hours: orderedHours
    };
}

function orderHours(hours) {

    var orderedHours = hours;

    for (var i = 0; i < orderedHours.length; i++) {

        const time = moment(orderedHours[i].startTime, 'HH:mm:ss');

        for (var x = 0; x < orderedHours.length; x++) {

            const compareTime = moment(orderedHours[x].startTime, 'HH:mm:ss');

            if (!time.isBefore(compareTime)) {
                const temp = orderedHours[i];
                orderedHours[i] = orderedHours[x];
                orderedHours[x] = temp;
            }


        }
    }
    
    orderedHours.reverse();

    return orderedHours;
}