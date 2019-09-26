import {
  GET_MODULES,
  NEW_MODULE,
  GET_MODULES_GRADE,
  UPDATE_MODULES_GRADE,
  UPDATE_MODULE
} from "./../../constants/action-types";

const modules = (state = [], action) => {
  switch (action.type) {
    case GET_MODULES_GRADE: {
      return Object.assign({}, state, {
        moduleGrades: action.moduleGrades
      });
    }

    case UPDATE_MODULES_GRADE: {
      var moduleGrades = [];

      console.log(state.moduleGrades);
      if (state.moduleGrades) {

        for(var i = 0, n = state.moduleGrades.length; i < n; i++) {
          var found = false;

          for(var x = 0, m = action.payload.length; x < m; x++) {
            if(state.moduleGrades[i].moduleGradeId === action.payload[x].moduleGradeId) {
              moduleGrades.push(action.payload[x]);
              found = true;
              break;
            }
          }

          if(!found) {
            moduleGrades.push(state.moduleGrades[x]);
          }
        }

        // for (var x = 0, n = action.payload.length; x < n; x++) {
        //   var exists = false;

        //   for (var i = 0; i < state.moduleGrades.length; i++) {
        //     if (
        //       action.payload[x].moduleGradeId ===
        //       state.moduleGrades[i].moduleGradeId
        //     ) {
        //       state.moduleGrades[i].moduleGrade = action.payload[x].moduleGrade;
        //       exists = true;
        //       moduleGrades.push(state.moduleGrades[i]);
        //     }
        //   }

        //   if (!exists) {
        //     moduleGrades.push(action.payload[x]);
        //   }
        // }
      } else {
        moduleGrades = action.payload;
      }

      return Object.assign({}, state, {
        moduleGrades: moduleGrades
      });
    }

    case GET_MODULES: {
      var modules = [];

      if (state.modules) {
        //modules = state.modules;
        modules = JSON.parse(JSON.stringify(state.modules));

        for (var i = 0; i < action.modules.length; i++) {
          var exists = false;
          for (var x = 0; x < state.modules.length; x++) {
            if (action.modules[i].moduleId === state.modules[x].moduleId) {
              exists = true;
            }
          }

          if (!exists) {
            modules.push(action.modules[i]);
          }
        }
      } else {
        modules = action.modules;
      }

      return Object.assign({}, state, {
        modules: modules
      });
    }

    case UPDATE_MODULE: {
      const modules = [];

      if (state.modules) {
        for (var i = 0, n = state.modules.length; i < n; i++) {
          if (state.modules[i].moduleId === action.payload.moduleId) {
            modules.push(action.payload);
          } else {
            modules.push(state.modules[i]);
          }
        }
      }

      return Object.assign({}, state, {
        modules: modules
      });
    }

    case NEW_MODULE: {
      var modules = [];

      if (state.modules) {
        //modules = state.modules;
        modules = JSON.parse(JSON.stringify(state.modules));
        state.modules.push(action.module);
      } else {
        modules.push(action.module);
      }

      return Object.assign({}, state, {
        modules: modules
      });
    }

    default:
      return state;
  }
};

export default modules;
