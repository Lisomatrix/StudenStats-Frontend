import { GET_GRADES, GET_TEST_GRADES, UPDATE_TEST_GRADES } from './../../constants/action-types';

const grades = (state = [], action) => {
  switch (action.type) {

    case GET_GRADES: {
      var grades = [];

      if(state.grades) {
        //grades = state.grades;
        grades = JSON.parse(JSON.stringify(state.grades));

        for(var i = 0; i < action.grades.length; i++) {
          grades.push(action.grades[i]);
        }
      } else {
        grades = action.grades;
      }

      return Object.assign({}, state, {
        grades: grades
      });
    }

    case UPDATE_TEST_GRADES: {
      var testGrades = [];

      if(state.testGrades) {
        for(var i = 0; i < state.testGrades.length; i++) {
          for(var x = 0; x < action.payload.length; x++) {
            
            if(state.testGrades[i].testGradeId === action.payload[x].testGradeId) {
              state.testGrades[i].grade = action.payload[x].grade;
              break;
            }
          }

          testGrades.push(state.testGrades[i]);
        }
      } else {
        testGrades = action.payload;
      }

      return Object.assign({}, state, {
        testGrades: testGrades
      });
    }

    case GET_TEST_GRADES: {
      var testGrades = [];
      
      if(state.testGrades) {
        //testGrades = state.testGrades;
        testGrades = JSON.parse(JSON.stringify(state.testGrades));

        for(var i = 0; i < action.payload.length; i++) {
          testGrades.push(action.payload[i]);
        }

      } else {
        testGrades = action.payload;
      }

      return Object.assign({}, state, {
        testGrades: testGrades
      })
    }

    default:
      return state;
  }
}

export default grades;