import { GET_ACCOUNTS, GET_ACCOUNT, DELETE_ACCOUNT } from './../../constants/action-types';

const admin = (state = [], action) => {
    switch(action.type) {

        case GET_ACCOUNTS: {

            const accounts = filterAccountsByRole(action.payload)

            return Object.assign({}, state, {
                accounts
            });
        }

        case GET_ACCOUNT: {
            var accounts = {
                students: [],
                teachers: [],
                parents: [],
                admins: []
            };

            if(state.accounts) {
                //accounts = state.accounts;
                accounts = JSON.parse(JSON.stringify(state.accounts));
            }

            if(action.payload.role === 'ROLE_ALUNO') {
                accounts.students.push(action.payload);
            } else if(action.payload.role === 'ROLE_PROFESSOR') {
                accounts.teachers.push(action.payload);
            } else if(action.payload.role === 'ROLE_PARENT') {
                accounts.parents.push(action.payload);
            } else if(action.payload.role === 'ROLE_ADMIN') {
                accounts.admins.push(action.payload);
            }
            
            return Object.assign({}, state, {
                accounts
            });
        }

        case DELETE_ACCOUNT: {

            //const accounts = state.accounts;
            const accounts = JSON.parse(JSON.stringify(state.accounts));

            var removed = false;

            for(var i = 0; i < accounts.students.length; i++) {
                if(accounts.students[i].userId === action.payload) {
                    accounts.students.splice(i, 1);
                    removed = true;
                    break;
                }
            }

            if(!removed) {
                for(var i = 0; i < accounts.teachers.length; i++) {
                    if(accounts.teachers[i].userId === action.payload) {
                        accounts.teachers.splice(i, 1);
                        removed = true;
                        break;
                    }
                }
            }

            
            if(!removed) {
                for(var i = 0; i < accounts.admins.length; i++) {
                    if(accounts.admins[i].userId === action.payload) {
                        accounts.admins.splice(i, 1);
                        removed = true;
                        break;
                    }
                }
            }

            if(!removed) {
                for(var i = 0; i < accounts.parents.length; i++) {
                    if(accounts.parents[i].userId === action.payload) {
                        accounts.parents.splice(i, 1);
                        removed = true;
                        break;
                    }
                }
            }

            return Object.assign({}, state, {
                accounts
            })
        }

        default:
            return state;
    }
}

export default admin;

function filterAccountsByRole(accounts) {

    const students = [];
    const teachers = [];
    const admins = [];
    const parents = [];

    for(var i = 0; i < accounts.length; i++) {
        if(accounts[i].role === 'ROLE_ALUNO') {
            students.push(accounts[i]);
        } else if(accounts[i].role === 'ROLE_PROFESSOR') {
            teachers.push(accounts[i]);
        } else if(accounts[i].role === 'ROLE_PARENT') {
            parents.push(accounts[i]);
        } else if(accounts[i].role === 'ROLE_ADMIN') {
            admins.push(accounts[i]);
        }
    }

    return { students, teachers, admins, parents };
}