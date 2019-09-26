import {
	GET_TESTS,
	TEST_NOT_FOUND,
	MARK_TEST,
	TEST_ERROR,
	MARK_TEST_READ,
	REMOVE_TEST,
	REMOVE_TEST_READ
} from './../../constants/action-types';

const tests = (state = [], action) => {
	switch (action.type) {
		case GET_TESTS: 
			return Object.assign({}, state, {
				tests: action.tests,
				notFound: false,
				testError: false
			});

		case TEST_NOT_FOUND:
			return Object.assign({}, state, {
				notFound: true
			});

		case MARK_TEST: {
			var newTests = [];

			if (state.tests) {
				state.tests.push(action.markTest);
				//newTests = state.tests;
				newTests = JSON.parse(JSON.stringify(state.tests));
			} else {
				newTests.push(action.markTest);
			}

			return Object.assign({}, state, {
				testMarked: true,
				tests: newTests,
				markTestRead: action.markTestRead
			});
		}

		case REMOVE_TEST: {
			var newTests = state.tests;

			for (var i = 0; i < newTests.length; i++) {
				if (newTests[i].testId === action.removeTest.testId) {
					newTests.splice(i, 1);
					break;
				}
			}

			return Object.assign({}, state, {
				tests: newTests,
				removeTest: true
			});
		}

		case TEST_ERROR:
			return Object.assign({}, state, {
				testError: true
			});

		case MARK_TEST_READ:
			return Object.assign({}, state, {
				markTestRead: false
			});

		case REMOVE_TEST_READ:
			return Object.assign({}, state, {
				removeTest: false
			});

		default:
			return state;
	}
};

export default tests;
