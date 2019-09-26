import {
  GET_USER_EDIT_DATA,
  GET_USER_EDIT_PARENT_STUDENTS,
  REMOVE_USER_EDIT_DATA,
  GET_USER_EDIT_PARENT_STUDENTS_ADD,
  GET_USER_EDIT_PARENT_STUDENTS_REMOVE,
  GET_USER_EDIT_STUDENT_DATA,
  GET_USER_EDIT_STUDENT_PARENT,
  GET_USER_EDIT_TEACHER_DISCIPLINES,
  REMOVE_DISCIPLINE_TEACHER,
  NEW_DISCIPLINE_TEACHER
} from "./../../constants/action-types";

const userEdit = (state = [], action) => {
  switch (action.type) {
    case GET_USER_EDIT_DATA: {
      return Object.assign({}, state, {
        user: action.payload
      });
    }

    case GET_USER_EDIT_TEACHER_DISCIPLINES: {
      return Object.assign({}, state, {
        teacherDisciplines: action.payload
      });
    }

    case REMOVE_DISCIPLINE_TEACHER: {
      const teacherDisciplines = [];

      if (state.teacherDisciplines) {
        for (var i = 0; i < state.teacherDisciplines.length; i++) {
          if (
            state.teacherDisciplines[i].disciplineId !==
            action.payload.disciplineId
          ) {
            teacherDisciplines.push(state.teacherDisciplines[i]);
          }
        }
      }

      return Object.assign({}, state, {
        teacherDisciplines: teacherDisciplines
      });
    }

    case NEW_DISCIPLINE_TEACHER: {
      const teacherDisciplines = [];

      if (state.teacherDisciplines) {
        for (var i = 0; i < state.teacherDisciplines.length; i++) {
          teacherDisciplines.push(state.teacherDisciplines[i]);
        }
      }

      teacherDisciplines.push(action.payload);

      return Object.assign({}, state, {
        teacherDisciplines: teacherDisciplines
      });
    }

    case GET_USER_EDIT_STUDENT_PARENT: {
      return Object.assign({}, state, {
        studentParent: action.payload
      });
    }

    case GET_USER_EDIT_PARENT_STUDENTS: {
      return Object.assign({}, state, {
        parentStudents: action.payload
      });
    }

    case GET_USER_EDIT_PARENT_STUDENTS_ADD: {
      var students = [];

      if (state.parentStudents) {
        for (var i = 0; i < state.parentStudents.length; i++) {
          students.push(state.parentStudents[i]);
        }
      }

      students.push(action.payload);

      return Object.assign({}, state, {
        parentStudents: students
      });
    }

    case GET_USER_EDIT_PARENT_STUDENTS_REMOVE: {
      const students = [];

      if (state.parentStudents) {
        for (var i = 0; i < state.parentStudents.length; i++) {
          if (state.parentStudents[i].studentId !== action.payload) {
            students.push(state.parentStudents[i]);
          }
        }
      }

      return Object.assign({}, state, {
        parentStudents: students
      });
    }

    case GET_USER_EDIT_STUDENT_DATA:
      return Object.assign({}, state, {
        student: action.payload
      });

    case REMOVE_USER_EDIT_DATA: {
      return {};
    }

    default:
      return state;
  }
};

export default userEdit;
