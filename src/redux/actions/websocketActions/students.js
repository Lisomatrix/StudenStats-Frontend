import { GET_STUDENTS, GET_STUDENTS_COMPLETE } from './../../../constants/action-types';

export function getStudents(students) {
	return {
		type: GET_STUDENTS,
		students: students
	};
}

export function getStudentsComplete() {
	return {
		type: GET_STUDENTS_COMPLETE
	};
}
