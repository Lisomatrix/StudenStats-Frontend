import {
  GET_STUDENTS,
  GET_STUDENTS_COMPLETE,
  GET_PARENT_STUDENT,
  GET_STUDENTS_WITHOUT_PARENT,
  ADD_STUDENTS_WITHOUT_PARENT,
  REMOVE_STUDENTS_WITHOUT_PARENT
} from "./../../constants/action-types";

const students = (state = [], action) => {
  switch (action.type) {
    case GET_PARENT_STUDENT:
      return Object.assign({}, state, {
        parentStudents: action.payload
      });

    case GET_STUDENTS: {
      var newStudents = action.students;

      // if (state.students) {
      //   newStudents = action.students.concat(state.students);
      // }

      return Object.assign({}, state, {
        students: newStudents,
        getStudents: true
      });
    }

    case GET_STUDENTS_COMPLETE:
      return Object.assign({}, state, {
        getStudents: false
      });

    case GET_STUDENTS_WITHOUT_PARENT:
      return Object.assign({}, state, {
        StudentsWithoutParent: action.payload
      });

    case ADD_STUDENTS_WITHOUT_PARENT: {
		const students = [];

		if(state.StudentsWithoutParent) {
			for(var i = 0; i < state.StudentsWithoutParent.length; i++) {
				students.push(state.StudentsWithoutParent[i]);
			}
		}

		students.push(action.payload);

		return Object.assign({}, state, {
			StudentsWithoutParent: students
		});
    }

	case REMOVE_STUDENTS_WITHOUT_PARENT: {
		const students = [];
		
		if(state.StudentsWithoutParent) {
			for(var i = 0; i < state.StudentsWithoutParent.length; i++) {
				if(state.StudentsWithoutParent[i].studentId !== parseInt(action.payload)) {
					students.push(state.StudentsWithoutParent[i]);
				}
			}
		}

		return Object.assign({}, state, {
			StudentsWithoutParent: students
		});
	}

    default:
      return state;
  }
};

export default students;
