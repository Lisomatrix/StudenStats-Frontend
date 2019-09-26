import {
	GET_LESSONS,
	NEW_LESSON,
	GET_LESSONS_COMPLETE,
	NEW_LESSON_COMPLETE,
	LESSON_SUMMARY_UPDATED,
	LESSON_SUMMARY_UPDATE
} from './../../../constants/action-types';

export function getLessons(lessons) {
	return {
		type: GET_LESSONS,
		lessons: lessons
	};
}

export function newLesson(lesson) {
	return {
		type: NEW_LESSON,
		lesson: lesson
	};
}

export function getLessonsComplete() {
	return {
		type: GET_LESSONS_COMPLETE
	};
}

export function newLessonComplete() {
	return {
		type: NEW_LESSON_COMPLETE
	};
}

export function setUpdateSummary(lesson) {
	return (dispatch) => {
		dispatch(updatedSummary(lesson));
	};
}

export function updateSummary(lesson) {
	return {
		type: LESSON_SUMMARY_UPDATE,
		lesson: lesson
	};
}

export function updatedSummary() {
	return {
		type: LESSON_SUMMARY_UPDATED
	};
}
