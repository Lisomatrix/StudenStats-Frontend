import React, { Component } from 'react';
import { Calendar, Modal } from 'antd';
import './../../styles/tests-calendar.less';
import { shallowEqual } from 'shouldcomponentupdate-children';

class TestsCalendar extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	info = (title, content) => {
		Modal.info({
			title: title,
			content: <div>{content}</div>,
			onOk() {}
		});
	};

	onSelect = (value) => {
		if (this.props.tests) {
			const foundTests = [];

			const selectedDay = value.date();
			const selectedMonth = value.month();
			const selectedYear = value.year();

			this.props.tests.forEach((test) => {
				if (selectedDay === test.day && selectedMonth === test.month && selectedYear === test.year) {
					foundTests.push(test);
				}
			});

			if (foundTests.length > 0) {
				const displayTest = foundTests.map((test) => {
					return <p key={test.testId}>{test.discipline}</p>;
				});

				this.info('Dia ' + selectedDay, displayTest);
			}
		}
	};

	getTestData = (value) => {
		if (this.props.tests) {
			const day = value.date();
			const month = value.month();
			const year = value.year();

			var testsNumber = 0;

			this.props.tests.forEach((test) => {
				if (day === test.day && month === test.month && year === test.year) {
					testsNumber++;
				}
			});

			return testsNumber;
		}
	};

	dateCellRender = (value) => {
		const testsNumber = this.getTestData(value);

		return (
			<div className="tests-container">
				<span className="tests">{testsNumber > 0 ? testsNumber + ' Testes' : null}</span>
			</div>
		);
	};

	render() {
		return (
			<div>
				<Calendar onSelect={this.onSelect} dateCellRender={this.dateCellRender} />
			</div>
		);
	}
}

export default TestsCalendar;
