import {
	GET_LESSONS,
	NEW_LESSON,
	GET_LESSONS_COMPLETE,
	NEW_LESSON_COMPLETE,
	LESSON_SUMMARY_UPDATED,
	LESSON_SUMMARY_UPDATE
} from './../../constants/action-types';

const lessons = (state = [], action) => {
	switch (action.type) {
		case GET_LESSONS: {
			var newLessons = [];

			if(!action.lessons) {
				//newLessons = state.lessons;
				newLessons = JSON.parse(JSON.stringify(state.lessons));
			} else {
				if (state.lessons) {
					newLessons = action.lessons.concat(state.lessons);
				} else {
					newLessons = action.lessons;
				}
			}
			//newLessons = sortLessons(newLessons);

			return Object.assign({}, state, {
				lessons: newLessons,
				getSuccess: true
			});
		}

		case NEW_LESSON: {
			var newLessons = [];

			if (state.lessons) {
				state.lessons.push(action.lesson);
				//newLessons = state.lessons;
				newLessons = JSON.parse(JSON.stringify(state.lessons));
			} else {
				newLessons.push(action.lesson);
			}

			return Object.assign({}, state, {
				lessons: newLessons,
				addSuccess: true
			});
		}

		case GET_LESSONS_COMPLETE:
			return Object.assign({}, state, {
				getSuccess: false
			});

		case NEW_LESSON_COMPLETE:
			return Object.assign({}, state, {
				addSuccess: false
			});

		case LESSON_SUMMARY_UPDATE: {

			var newLessons = [];

			if(state.lessons)
				//newLessons = state.lessons;
				newLessons = JSON.parse(JSON.stringify(state.lessons));

			newLessons.find((lesson) => {
				if (lesson.lessonId === action.lesson.lessonId) {
					lesson = action.lessonId;
					return;
				}
			});

			return Object.assign({}, state, {
				lessons: newLessons
			});
		}

		case LESSON_SUMMARY_UPDATED:
			return state;

		default:
			return state;
	}
};

function sortLessons(lessons) {
	for (var i = 0; i < lessons.length; i++) {
		for (var x = 0; x < lessons.length; x++) {
			if (lessons[x].lessonNumber > lessons[i].lessonNumber) {
				const tempLesson = lessons[x];

				lessons[x] = lessons[i];

				lessons[i] = tempLesson;
			}
		}
	}

	return lessons;
}

export default lessons;
