import { config } from './../../constants/config';
import {
	getAbsences,
	MarkAbsence,
	JustifyAbsence,
	readMarkedAbsence,
	getAbsencesComplete,
	getAbsenceTypes,
	getClassAbsences,
	RemoveAbsence
} from './websocketActions/absences';
import { getTests, markTest, markTestRead, removeTest, removeTestRead } from './websocketActions/tests';
import {
	getLessons,
	newLesson,
	getLessonsComplete,
	newLessonComplete,
	updatedSummary
} from './websocketActions/lesson';
import { getClasses, classesError } from './../actions/websocketActions/classes';
import { getDisciplines, getTeacherDisciplines, getClassDisciplines } from './../actions/websocketActions/disciplines';
import { getStudents, getStudentsComplete } from './../actions/websocketActions/students';
import { connected, setStorage } from './websocketActions/connect';
import { setTheme } from './theme';
import { getModules, newModule, getModuleGrades } from './websocketActions/modules';
import { getGrades } from './websocketActions/grades';
import { getSchedule, getDays, getHours } from './websocketActions/schedules';


const prefix = '/app';
// CONNECTION & DISCONNECTION START

// DISCONNECT
export function disconnectWebsocket() {
	return (dispatch) => {
		
	};
}

// CONNECTION
export function connectWebsocket(token) {
	return (dispatch) => {
		
	};
}

// START ABSENCES

// ABSENCE SENDERS

//SEND GET CLASS ABSENCE
export function sendGetClassAbsences(classId) {
	return (dispatch) => {
	};
}

//SEND MARK ABSENCE
export function sendMarkAbsence(markAbsence) {
	return (dispatch) => {
		
		
		
	};
}

// SEND JUSTIFY ABSENCE
export function sendJustifyAbsence(justifyAbsence) {
	return (dispatch) => {
		
		
	};
}

// SEND GET ABSENCES
export function sendGetAbsences() {
	const lesson = {
		lessonId: 0
	};

	return (dispatch) => {
	};
}

// SEND GET ABSENCES BY LESSON
export function sendGetAbsencesByLesson(lesson) {
	return (dispatch) => {
		
	};
}

export function sendGetAbsencesByLessonComplete() {
	return (dispatch) => {
		dispatch(getAbsencesComplete());
	};
}

// ABSENCE MARKED NOTIFICATION
export function readedMarkedAbsenceNotification() {
	return (dispatch) => {
		dispatch(readMarkedAbsence());
	};
}

export function sendGetAbsenceTypes() {
	return (dispatch) => {
		
	};
}

// END ABSENCES

// START TESTS

// SEND GET TESTS
export function sendGetTests() {
	return (dispatch) => {
		
	};
}

export function sendMarkTest(test) {
	return (dispatch) => {
	
	};
}

export function sendRemoveTest(test) {
	return (dispatch) => {
	
	};
}

export function setMarkTestRead() {
	return (dispatch) => {
		dispatch(markTestRead());
	};
}

export function setRemoveTestRead() {
	return (dispatch) => {
		dispatch(removeTestRead());
	};
}

// END TESTS

// START CLASSES

export function sendGetClasses() {
	return (dispatch) => {
	
	};
}

// END CLASSES

// START DISCIPLINES

export function sendGetTeacherDisciplines() {
	return (dispatch) => {
		
	};
}

export function sendGetClassDisciplines() {
	return (dispatch) => {
	
	};
}

// END DISCIPLINES

// START LESSONS

export function sendUpdateSummary(updateSummary) {
	return (dispatch) => {
		
	};
}

export function sendCreateLesson(createLessonRequest) {
	return (dispatch) => {
		
	};
}

export function sendGetLessons(lessonsRequest) {
	return (dispatch) => {
	
	};
}

export function sendAddLessonComplete() {
	return (dispath) => {
		dispath(newLessonComplete());
	};
}

export function sendGetLessonsComplete() {
	return (dispatch) => {
		dispatch(getLessonsComplete());
	};
}

// END LESSONS

// START STUDENTS

export function sendGetStudents(getStudents) {
	return (dispatch) => {
	
	};
}

export function sendGetStudentsComplete() {
	return (dispatch) => {
		dispatch(getStudentsComplete());
	};
}

// END STUDENTS

// START THEME

// END THEME

export function sendUpdateTheme(theme) {
	return (dispatch) => {
	
	};
}

// END THEME

// START MODULE

export function sendGetModules() {
	return (dispatch) => {
	
	};
}

export function sendGetModuleGrades() {
	return (dispatch) => {
		
	};
}

export function sendGetModulesByDiscipline(discipline) {
	return (dispatch) => {
	
	};
}

export function sendAddModule(newModule) {
	return (dispatch) => {
		
	};
}

// END MODULE

// START GRADES

export function sendGetGrades() {
	return (dispatch) => {
	
	};
}

// END GRADES

// STAR SCHEDULE

export function sendGetSchedule() {
	return (dispatch) => {
		
	};
}

export function sendGetDays() {
	return (dispatch) => {
		
	};
}

export function sendGetHours() {
	return (dispatch) => {
		
	};
}

// END SCHEDULE

// START HOURS RECUPERATION

export function sendRecuperateHours(recuperated) {
	return (dispatch) => {
	
	};
}

// END HOURS RECUPERATION