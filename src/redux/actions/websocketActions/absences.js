import {
	READ_MARKED_ABSENCE,
	GET_ABSENCES,
	SEND_MARK_ABSENCE,
	JUSTIFY_ABSENCE,
	ABSENCE_ERROR,
	MARKED_ABSENCE,
	GET_ABSENCES_COMPLETE,
	GET_ABSENCE_TYPES,
	REMOVED_ABSENCE,
	GET_CLASS_ABSENCES
} from './../../../constants/action-types';

export function getClassAbsences(ClassAbsences) {
	return {
		type: GET_CLASS_ABSENCES,
		classAbsences: ClassAbsences
	}
}

export function getAbsenceTypes(absenceTypes) {
	return {
		type: GET_ABSENCE_TYPES,
		absenceTypes: absenceTypes
	};
}

export function getAbsences(absences) {

	var newAbsences = [];

	if(absences) {
		newAbsences = absences;	
	}

	newAbsences.forEach((element) => {
		element = addDayandDate(element);
	});
 
	return {
		type: GET_ABSENCES,
		absences: newAbsences
	};
}

export function getAbsencesComplete() {
	return {
		type: GET_ABSENCES_COMPLETE
	};
}

export function MarkAbsence(absence) {
	return {
		type: SEND_MARK_ABSENCE,
		absence: absence
	};
}

export function RemoveAbsence(absences) {
	return {
		type: REMOVED_ABSENCE,
		removeAbsence: absences
	};
}

export function JustifyAbsence(absence) {
	return {
		type: JUSTIFY_ABSENCE,
		absence: absence
	};
}

export function errorAbsence() {
	return {
		type: ABSENCE_ERROR
	};
}

export function markedAbsence() {
	return {
		type: MARKED_ABSENCE,
		markedAbsence: true
	};
}

export function readMarkedAbsence() {
	return {
		type: READ_MARKED_ABSENCE,
		markedAbsence: false
	};
}

function addDayandDate(absence) {
	const dateAndTime = formatDate(absence.date);

	absence.date = dateAndTime.date;
	absence.time = dateAndTime.time;

	return absence;
}

function formatDate(timeStamp) {
	const date = timeStamp.substring(0, 10);
	const time = timeStamp.substring(16, 11);

	return { date, time };
}
