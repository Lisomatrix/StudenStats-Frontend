import { GET_TEACHER, GET_DIRECTOR_TEACHERS, GET_FREE_TEACHERS, SET_DIRECTOR_TEACHER, SET_FREE_TEACHER } from './../../constants/action-types';

const teachers = (state = [], action) => {
    switch(action.type) {

        case GET_TEACHER: 
            return Object.assign({}, state, {
                teachers: action.payload
            });

        case GET_DIRECTOR_TEACHERS:
            return Object.assign({}, state, {
                classDirectors: action.payload
            });

        case GET_FREE_TEACHERS:
            return Object.assign({}, state, {
                freeTeachers: action.payload
            });

        case SET_DIRECTOR_TEACHER: {

            var freeTeachers = action.freeTeachers;
            const directorTeachers = action.classDirectors;

            for(var i = 0; i < freeTeachers.length; i++) {
                if(action.payload.teacherId === freeTeachers[i].teacherId) {
                    freeTeachers[i] = action.payload;
                }
            }

            for(var i = 0; i < directorTeachers.length; i++) {
                if(action.payload.teacherId == directorTeachers[i].teacherId) {
                    freeTeachers = freeTeachers.splice(i, 1);
                }
            }

            return Object.assign({}, state, {
                freeTeachers: freeTeachers,
                classDirectors: directorTeachers
            });
        }

        case SET_FREE_TEACHER: {

            const freeTeachers = action.freeTeachers;
            var directorTeachers = action.classDirectors

            for(var i = 0; i < freeTeachers.length; i++) {
                if(action.payload.teacherId === freeTeachers[i].teacherId) {
                    freeTeachers[i] = action.payload;
                }
            }

            for(var i = 0; i < directorTeachers.length; i++) {
                if(action.payload.teacherId == directorTeachers[i].teacherId) {
                    directorTeachers = directorTeachers.splice(i, 1);
                }
            }

            return Object.assign({}, state, {
                freeTeachers: freeTeachers,
                classDirectors: directorTeachers
            });
        }
        
        default:
            return state;
    }
}

export default teachers;