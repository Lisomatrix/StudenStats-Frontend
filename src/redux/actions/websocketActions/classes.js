import { GET_CLASSES, CLASSES_ERROR } from './../../../constants/action-types';

export function getClasses(classes) {
	return {
		type: GET_CLASSES,
		classes: classes,
		error: false
	};
}

export function classesError() {
	return {
		type: CLASSES_ERROR,
		error: true
	};
}
