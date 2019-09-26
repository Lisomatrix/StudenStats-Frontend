import {
  GET_STUDENT_PHOTO,
  GET_CLASSES,
  CLASSES_ERROR,
  GET_STUDENT_CLASS,
  GET_COURSES,
  ADD_CLASS,
  REMOVE_CLASS,
  UPDATE_CLASS,
  ADD_STUDENT_TO_CLASS,
  REMOVE_STUDENT_FROM_CLASS,
  UPDATE_COURSE,
  ADD_COURSE
} from "./../../constants/action-types";
import lessons from "./lessons";

const classes = (state = [], action) => {
  switch (action.type) {
    case GET_STUDENT_PHOTO: {
      const classes = [];

      if (state.classes) {
        for (var i = 0; i < state.classes.length; i++) {
          classes.push(state.classes[i]);
        }
      }

      var found = false;

      for (var i = 0; i < classes.length; i++) {
        const iClass = classes[i];

        if (found) {
          break;
        }

        if (iClass.students && iClass.students.length > 0) {
          for (var x = 0; x < iClass.students.length; x++) {
            if (iClass.students[x].studentId === action.studentId) {
              iClass.students[x].photo = action.imgUrl;
              found = true;
              break;
            }
          }
        }
      }

      return Object.assign({}, state, {
        classes: classes
      });
    }

    case ADD_STUDENT_TO_CLASS: {
      const classes = [];

      var newStudent;

      for (var i = 0; i < action.payload.students.length; i++) {
        if (
          action.payload.students[i].studentId === parseInt(action.studentId)
        ) {
          newStudent = action.payload.students[i];
          break;
        }
      }

      if (state.classes && newStudent) {
        for (var i = 0; i < state.classes.length; i++) {
          if (state.classes[i].classId === action.payload.classId) {
            state.classes[i].students.push(newStudent);
          }

          classes.push(state.classes[i]);
        }
      }

      return Object.assign({}, state, {
        classes: classes
      });
    }

    case REMOVE_STUDENT_FROM_CLASS: {
      const classes = [];

      if (state.classes) {
        var changed = true;
        var changedClass;

        for (var i = 0; i < state.classes.length; i++) {
          if (state.classes[i].classId === parseInt(action.payload.classId)) {
            const students = [];

            for (var x = 0; x < state.classes[i].students.length; x++) {
              if (
                state.classes[i].students[x].studentId !==
                parseInt(action.studentId)
              ) {
                students.push(state.classes[i].students[x]);
              }
            }

            state.classes[i].students = students;
            changed = true;
            changedClass = state.classes[i];
          }

          if (changed) {
            classes.push(changedClass);
            changed = false;
            changedClass = undefined;
          } else {
            classes.push(state.classes[i]);
          }
        }
      }

      return Object.assign({}, state, {
        classes: classes
      });
    }

    case GET_CLASSES: {
      const newClasses = sortClasses(action.classes);

      return Object.assign({}, state, {
        classes: newClasses,
        error: action.error
      });
    }

    case CLASSES_ERROR:
      return Object.assign({}, state, {
        error: true
      });

    case GET_STUDENT_CLASS:
      return Object.assign({}, state, {
        studentClass: action.payload
      });

    case GET_COURSES:
      return Object.assign({}, state, {
        courses: action.payload
      });

    case UPDATE_COURSE: {
      const courses = [];

      if (state.courses) {
        for (var i = 0; i < state.courses.length; i++) {
          if (state.courses[i].courseId === action.payload.courseId) {
            state.courses[i] = action.payload;
          }

          courses.push(state.courses[i]);
        }
      }

      return Object.assign({}, state, {
        courses: courses
      });
    }

    case ADD_COURSE: {
      const courses = [];

      if (state.courses) {
        for (var i = 0; i < state.courses.length; i++) {
          courses.push(state.courses[i]);
        }
      }

      courses.push(action.payload);

      return Object.assign({}, state, {
        courses: courses
      });
    }

    case ADD_CLASS: {
      var classes = [];

      if (state.classes) {
        classes = state.classes;
      }

      classes.push(action.payload);

      return Object.assign({}, state, {
        classes: classes
      });
    }

    case REMOVE_CLASS: {
      const classes = [];

      for (var i = 0; i < state.classes.length; i++) {
        if (state.classes[i].classId !== action.payload) {
          classes.push(state.classes[i]);
        }
      }

      return Object.assign({}, state, {
        classes: classes
      });
    }

    case UPDATE_CLASS: {
      const classes = [];

      for (var i = 0; i < state.classes.length; i++) {
        if (state.classes[i].classId === action.payload.classId) {
          classes.push(action.payload);
        } else {
          classes.push(state.classes[i]);
        }
      }

      return Object.assign({}, state, {
        classes: classes
      });
    }

    default:
      return state;
  }
};

function sortClasses(classes) {
  for (var i = 0; i < classes.length; i++) {
    for (var x = 0; x < lessons.length; x++) {
      if (classes[x].name > classes[i].name) {
        const tempClass = classes[x];

        classes[x] = classes[i];

        classes[i] = tempClass;
      }
    }
  }

  return classes;
}

export default classes;
