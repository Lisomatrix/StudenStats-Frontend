import { GET_DISCIPLINES, GET_TEACHER_DISCIPLINES, GET_CLASS_DISCIPLINES } from './../../../constants/action-types';

export function getClassDisciplines(classDisciplines) {
	return {
		type:GET_CLASS_DISCIPLINES,
		classDisciplines: classDisciplines
	};
}

export function getDisciplines(disciplines) {
	return {
		type: GET_DISCIPLINES,
		disciplines: disciplines
	};
}

export function getTeacherDisciplines(disciplines) {
	return {
		type: GET_TEACHER_DISCIPLINES,
		teacherDisciplines: disciplines
	};
}
