import { GET_DISCIPLINES, GET_TEACHER_DISCIPLINES, GET_CLASS_DISCIPLINES, ADD_DISCIPLINE, UPDATE_DISCIPLINE } from './../../constants/action-types';

const disciplines = (state = [], action) => {
	switch (action.type) {

		case GET_CLASS_DISCIPLINES: {
			const newDisciplines = sortDisciplines(action.classDisciplines);

			return Object.assign({}, state, {
				classDisciplines: newDisciplines
			});
		}

		case GET_DISCIPLINES: {
			const newDisciplines = sortDisciplines(action.payload);

			return Object.assign({}, state, {
				disciplines: newDisciplines
			});
		}

		case ADD_DISCIPLINE: {
			const disciplines = [];

			if(state.disciplines) {
				for(var i = 0; i < state.disciplines[i].length; i++) {
					disciplines.push(state.disciplines[i]);
				}
			}

			disciplines.push(action.payload);

			return Object.assign({}, state, {
				disciplines: disciplines
			});
		}

		case UPDATE_DISCIPLINE: {
			const disciplines = [];

			if(state.disciplines) {
				for(var i = 0; i < state.disciplines.length; i++) {
					if(state.disciplines[i].disciplineId === action.payload.disciplineId) {
						disciplines.push(action.payload);
					} else {
						disciplines.push(state.disciplines[i]);
					}
				}
			}

			return Object.assign({}, state, {
				disciplines: disciplines
			});
		}

		case GET_TEACHER_DISCIPLINES: {
			const newDisciplines = sortDisciplines(action.teacherDisciplines);
			return Object.assign({}, state, {
				teacherDisciplines: newDisciplines
			});
		}

		default:
			return state;
	}
};

function sortDisciplines(disciplines) {
	for (var i = 0; i < disciplines.length; i++) {
		for (var x = 0; x < disciplines.length; x++) {
			if (disciplines[x].name > disciplines[i].name) {
				const tempDiscipline = disciplines[x];

				disciplines[x] = disciplines[i];

				disciplines[i] = tempDiscipline;
			}
		}
	}

	return disciplines;
}

export default disciplines;
