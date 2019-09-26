import {
	GET_TESTS,
	MARK_TEST,
	TEST_ERROR,
	TEST_NOT_FOUND,
	MARK_TEST_READ,
	REMOVE_TEST,
	REMOVE_TEST_READ
} from './../../../constants/action-types';

export function getTests(tests) {
	const newTests = tests;

	newTests.forEach((element) => {
		element = addDayandDate(element);
	});

	return {
		type: GET_TESTS,
		tests: newTests
	};
}

export function markTest(data) {
	const newMarkedTest = addDayandDate(data);
	
	return {
		type: MARK_TEST,
		markTestRead: true,
		markTest: newMarkedTest
	}
}

export function removeTest(test) {
	return {
		type: REMOVE_TEST,
		removeTest: test
	};
}

export function removeTestRead() {
	return {
		type: REMOVE_TEST_READ,
		removeTestRead: false
	};
}

export function markTestRead() {
	return {
		type: MARK_TEST_READ,
		markTestRead: false
	};
}

export function errorTest() {
	return {
		type: TEST_ERROR
	};
}

export function testsNotFound() {
	return {
		type: TEST_NOT_FOUND
	};
}

function addDayandDate(test) {
	const dateAndTime = formatDate(test.date);

	test.date = dateAndTime.date;
	test.time = dateAndTime.time;

	test.day = parseInt(test.date.substring(0, 2));
	test.month = parseInt(test.date.substring(3, 5) - 1);
	test.year = parseInt(test.date.substring(6, 10));

	return test;
}

function formatDate(timeStamp) {
	const date = timeStamp.substring(0, 10);
	const time = timeStamp.substring(16, 11);

	return { date, time };
}
