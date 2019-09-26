import React, { Component } from 'react';
import { message, Calendar, Modal, Button } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { shallowEqual } from 'shouldcomponentupdate-children';

class MarkTestCalendar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ModalText: '',
			visible: false,
			confirmLoading: false,
			ExistingTests: '',
			selectedDay: 0,
			selectedMonth: 0,
			selectedYear: 0,
			sent: false,
			removeTestSent: false,
			foundTests: [],
			displayTests: []
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	removeMarkedTest = (e) => {
		const testId = parseInt(e.target.parentElement.getAttribute('testid'));

		const tests = this.props.tests;

		var foundTest = undefined;

		for (var i = 0; i < tests.length; i++) {
			if (tests[i].testId === testId) {
				foundTest = tests[i];
				break;
			}
		}

		if (foundTest !== undefined) {

			this.setState({ removeTestSent: true }, () => {

				this.handleCancel();

				this.props.removeTest(this.props.selectedClass, foundTest.testId);
			});
		}
	};

	showModal = () => {
		this.setState({ visible: true });
	};

	mark = () => {
		if (this.props.isDisciplineSelected) {
			this.setState({ confirmLoading: true });

			const date = this.state.selectedYear + '-' + (this.state.selectedMonth + 1) + '-' + this.state.selectedDay;

			const markValues = {
				date: date,
				disciplineId: 1
			};

			this.props.markTest(markValues);
		} else {
			message.error('Selecione uma disciplina!');
		}
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};

	onSelect = (value) => {
		if (this.props.selectedClass) {
			const foundTests = [];

			const selectedDay = value.date();
			const selectedMonth = value.month();
			const selectedYear = value.year();

			if (this.props.tests) {
				this.props.tests.forEach((test) => {
					if (
						this.props.selectedClass === test.classId &&
						selectedDay === test.day &&
						selectedMonth === test.month &&
						selectedYear === test.year
					) {
						foundTests.push(test);
					}
				});
			}

			var today = new Date();

			const valueDate = value.toDate();

			if (today < valueDate && valueDate.getDay() !== 6 && valueDate.getDay() !== 0) {
				this.setState({
					ModalText: 'Marcar teste no dia ' + selectedDay + ' ?',
					selectedDay: selectedDay,
					selectedMonth: selectedMonth,
					selectedYear: selectedYear,
					foundTests: foundTests,
					sent: true
				});
				this.showModal();
			} else if (valueDate.getDay() !== 6 && valueDate.getDay() !== 0 && foundTests.length > 0) {
				const displayTest = foundTests.map((test) => <p key={test.testId}>{test.disciplina}</p>);
				this.info('Dia ' + value.date(), displayTest);
			}
		} else {
			message.error('Selecione uma turma!');
		}
	};

	getTestData = (value) => {
		if (this.props.tests && this.props.selectedClass) {
			const day = value.date();
			const month = value.month();
			const year = value.year();

			var testsNumber = 0;

			this.props.tests.forEach((test) => {
			
			if (
					this.props.selectedClass === test.classId &&
					day === test.day &&
					month === test.month &&
					year === test.year
				) {
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
				<span className="tests">
					{testsNumber > 0 ? testsNumber + (testsNumber > 1 ? ' Testes' : ' Teste') : null}
				</span>
			</div>
		);
	};

	info = (title, content) => {
		Modal.info({
			title: title,
			content: <div>{content}</div>,
			onOk() {}
		});
	};

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.isMarkTestRead) {
			if (nextProps.isMarkTestRead === true && this.state.sent) {
				this.props.markTestRead();
				nextState.confirmLoading = false;
				nextState.sent = false;
				nextState.visible = false;

				message.success('Teste marcado');
			} else if (this.state.sent) {
				this.props.markTestRead();
			}
		}

		if (nextProps.isRemoveRead) {
			if (nextProps.isRemoveRead === true && this.state.removeTestSent) {
				this.props.removeTestRead();
				nextState.removeTestSent = false;

				message.success('Teste Removido');
			} else if (this.state.removeTestSent) {
				this.props.removeTestRead();
			}
		}

		if (nextState.foundTests) {
			var tests = nextState.foundTests.map((test) => {
				return (
					<div testid={test.testId} key={test.testId} className="marked-test-container">
						{test.teacherId === nextProps.teacherId ? (
							<Button
								onClick={this.removeMarkedTest}
								className="remove-btn"
								shape="circle"
								icon="minus"
								type="danger"
							/>
						) : (
							''
						)}
						<p className="discipline">{test.discipline}</p>
					</div>
				);
			});

			nextState.displayTests = tests;
		}

		return true;
	}

	render() {
		const cancelBtnProps = {
			disabled: this.state.confirmLoading
		};

		return (
			<div>
				<Calendar onSelect={this.onSelect} dateCellRender={this.dateCellRender} />
				<Modal
					title="Marcar teste"
					visible={this.state.visible}
					onOk={this.mark}
					confirmLoading={this.state.confirmLoading}
					onCancel={this.handleCancel}
					closable={false}
					maskClosable={false}
					okText="Marcar"
					cancelButtonProps={cancelBtnProps}
				>
					<div>
						{this.state.displayTests && this.state.displayTests.length > 0 ? (
							<h3>Testes ja marcados:</h3>
						) : null}
						<QueueAnim delay={150} className="queue-simple">
							{this.state.displayTests}
						</QueueAnim>
						<p>{this.state.ModalText}</p>
					</div>
				</Modal>
			</div>
		);
	}
}

export default MarkTestCalendar;
