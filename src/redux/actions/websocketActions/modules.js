import { GET_MODULES, NEW_MODULE, GET_MODULES_GRADE } from './../../../constants/action-types';

export function getModuleGrades(moduleGrades) {
  return {
    type: GET_MODULES_GRADE,
    moduleGrades: moduleGrades
  }
}

export function getModules(modules) {
  return {
    type: GET_MODULES,
    modules: modules
  }
}

export function newModule(newModule) {
  return {
    type: NEW_MODULE,
    module: newModule
  }
}