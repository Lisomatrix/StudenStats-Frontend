import { GET_GRADES } from './../../../constants/action-types';

export function getGrades(grades) {
  return {
    type: GET_GRADES,
    grades: grades
  }
}