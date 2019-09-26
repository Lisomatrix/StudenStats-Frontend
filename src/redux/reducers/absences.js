import {
	ABSENCE_ERROR,
	JUSTIFY_ABSENCE,
	SEND_MARK_ABSENCE,
	GET_ABSENCES,
	GET_ABSENCES_COMPLETE,
	GET_ABSENCE_TYPES,
	REMOVED_ABSENCE,
	GET_CLASS_ABSENCES,
	RECUPERATE_ABSENCE
} from './../../constants/action-types';

const absences = (state = [], action) => {
	switch (action.type) {

		case GET_CLASS_ABSENCES:
			return Object.assign({}, state, {
				classAbsences: action.classAbsences
			});

		case ABSENCE_ERROR:
			return Object.assign({}, state, {
				absenceError: true
			});

		case RECUPERATE_ABSENCE: {

			var newAbsences = [];

			newAbsences = state.classAbsences.map((absence) => {
				if(absence.absenceId === action.payload.absenceId) {
					absence.recuperated = action.payload.recuperated
				}
				
				return absence;
			});

			return Object.assign({}, state, {
				classAbsences: newAbsences
			});
		}

		case JUSTIFY_ABSENCE: {

			var absences = [];

			if(action.absence) {
				if(state.classAbsences) {
					absences = state.classAbsences.map((absence) => {
						if(absence.absenceId === action.absence.absenceId) {
							absence.justified = action.absence.justified;
						}
		
						return absence;
					});
				} else {
					absences.push(action.absence);
				}
			} else if(state.classAbsences) {
				absences = state.classAbsences;
			}

			return Object.assign({}, state, {
				absenceJustify: true,
				classAbsences: absences
			});
		}
		
		case SEND_MARK_ABSENCE: {
			var absences = [];
			
			if (state.absences) {
				absences = state.absences.concat(action.absence);
			} else {
				absences.push(action.absence);
			}

			return Object.assign({}, state, {
				markAbsenceSuccess: true,
				absences: absences
			});
		}

		case REMOVED_ABSENCE: {
			var newAbsences = [];
			
			if(!action.removeAbsence.error) {
				if (state.absences) {
					state.absences.forEach((absence) => {
						action.removeAbsence.forEach((remove) => {
							if (absence.absenceId !== remove.absenceId) {
								newAbsences.push(absence);
							}
						});
					});
				}
			} else {
				newAbsences = state.absences;
			}

			return Object.assign({}, state, {
				absences: newAbsences
			});
		}

		case ABSENCE_ERROR:
			return Object.assign({}, state, {
				absenceError: true
			});

		case GET_ABSENCES: {
			var newAbsences = action.absences;

			if (state.absences) {
				newAbsences = action.absences.concat(state.absences);
			}

			return Object.assign({}, state, {
				absences: newAbsences,
				getAbsences: true
			});
		}

		case GET_ABSENCES_COMPLETE:
			return Object.assign({}, state, {
				getAbsences: false
			});

		case GET_ABSENCE_TYPES:
			return Object.assign({}, state, {
				absenceTypes: action.absenceTypes
			});

		default:
			return state;
	}
};

export default absences;
