import { LOGOUT } from './../../constants/action-types';
import { combineReducers } from 'redux';
import authentication from './authentication';
import register from './register';
import reset from './reset';
import absences from './absences';
import connect from './connect';
import tests from './tests';
import classes from './classes';
import disciplines from './disciplines';
import lessons from './lessons';
import students from './students';
import theme from './theme';
import modules from './modules';
import grades from './grades';
import schedules from './schedule';
import storage from './storage';
import homeworks from './homeworks';
import teachers from './teachers';
import admin from './admin';
import userEdit from './userEdit';

export const appReducer = combineReducers({
	authentication,
	absences,
	connect,
	register,
	reset,
	classes,
	tests,
	disciplines,
	lessons,
	students,
	theme,
	modules,
	grades,
	schedules,
	storage,
	homeworks,
	teachers,
	admin,
	userEdit
});

export const rootReducer = (state, action) => {
	if (action.type === LOGOUT) {
		state = undefined;
	}

	return appReducer(state, action);
};
