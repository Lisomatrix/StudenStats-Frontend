import React, { Component } from 'react';
import MarkTestCalendar from './../../../components/mark-test-components/mark-test-calendar';
import { connect } from 'react-redux';
import { message, Select } from 'antd';
import './../../../styles/mark-test.less';
import { sendMarkTest, setMarkTestRead, sendRemoveTest, setRemoveTestRead } from './../../../redux/actions/websocket';
import { requestMarkTest, requestRemoveClassTest, requestClassTests } from './../../../redux/actions/restActions/test';
import { requestModulesByDescipline } from './../../../redux/actions/restActions/module';
import { requestTeacherDisciplines } from './../../../redux/actions/restActions/discipline';
import { shallowEqual } from 'shouldcomponentupdate-children';

const Option = Select.Option;

class MarkTest extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedClass: null,
			selectedDiscipline: null,
			selectedModule: null
		};
	}

	componentWillMount() {

		if (!this.props.teacherDisciplines) {
			this.props.requestTeacherDisciplines()
				.then((result) => {
					if (result) {
						for (var i = 0; i < result.length; i++) {
							this.props.requestModulesByDescipline(result[i].disciplineId);
						}
					}
				})
		}

		if (this.props.teacherDisciplines) {
			for (var i = 0; i < this.props.teacherDisciplines; i++) {
				this.props.requestModulesByDescipline(this.props.teacherDisciplines[i].disciplineId);
			}
		}

	}

	componentWillUpdate(nextProps, nextState) {

		if (!nextProps.tests && nextProps.tests > 0) {
			nextProps.requestClassTests(nextState.selectedClass);
		}
	}

	mark = (values) => {
		if (this.state.selectedDiscipline && this.state.selectedModule) {
			const markTest = {
				classId: this.state.selectedClass,
				date: values.date,
				disciplineId: this.state.selectedDiscipline,
				teacherId: this.props.teacherId,
				moduleId: this.state.selectedModule
			};

			this.props.requestMarkTest(this.state.selectedClass, markTest);
		} else {
			if (!this.state.selectedModule) {
				message.error('Selecione um módulo/UFCDmódulo!');
			} else if (this.state.selectedDiscipline) {
				message.error('Selecione uma disciplina!');
			}
		}
	};

	handleClassChange = (value) => {

		if (this.props.tests) {
			var found = false;

			for (var i = 0; i < this.props.tests.length; i++) {
				if (this.props.tests[i].classId === value) {
					found = true;
					break;
				}
			}

			if (!found) {
				this.props.requestClassTests(value);
			}
		}

		this.setState({ selectedClass: value });
	};

	handleDisciplineChange = (value) => {
		this.setState({ selectedDiscipline: value });
	};

	handleModuleChange = (value) => {
		this.setState({ selectedModule: value });
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		var avaibleClasses;
		var avaibleDisciplines;
		var avaibleModules;

		if (this.props.classes) {
			avaibleClasses = this.props.classes.map((item) => {
				return (
					<Option key={item.classId} value={item.classId}>
						{item.name}
					</Option>
				);
			});
		}

		if (this.props.teacherDisciplines) {
			avaibleDisciplines = this.props.teacherDisciplines.map((item) => {
				return (
					<Option key={item.disciplineId} value={item.disciplineId}>
						{item.abbreviation}
					</Option>
				);
			});
		}

		if (this.props.modules) {
			avaibleModules = this.props.modules.map((item) => {
				return (
					<Option key={item.moduleId} value={item.moduleId}>
						{item.name}
					</Option>
				);
			});
		}

		return (
			<div className="mark-test-container animated slideInUp container-size">
				<div className="ant-card-bordered">
					<div className="classes-container">
						{window.innerWidth > 500 ? <label style={{ gridRow: '1', gridColumn: '1' }}>Turma:</label> : ''}
						<Select showSearch placeholder="Selecionar turma..." onChange={this.handleClassChange}>
							{avaibleClasses}
						</Select>
						{window.innerWidth > 500 ? <label style={{ gridRow: '1', gridColumn: '2' }}>Disciplina:</label> : ''}

						<Select showSearch placeholder="Marcar teste de..." onChange={this.handleDisciplineChange}>
							{avaibleDisciplines}
						</Select>
						{window.innerWidth > 500 ? <label style={{ gridRow: '1', gridColumn: '3' }}>Módulo:</label> : ''}

						<Select showSearch placeholder="Selecionar Módulo/UFCD" onChange={this.handleModuleChange}>
							{avaibleModules}
						</Select>
					</div>
					<div className="mark-test-calendar-container">
						<MarkTestCalendar
							isDisciplineSelected={this.state.selectedDiscipline}
							isMarkTestRead={this.props.markTestRead}
							markTestRead={this.props.setMarkTestRead}
							markTest={this.mark}
							tests={this.props.tests}
							selectedClass={this.state.selectedClass}
							teacherId={this.props.roleEntityId}
							removeTest={this.props.requestRemoveClassTest}
							removeTestRead={this.props.setRemoveTestRead}
							isRemoveRead={this.props.removeTest}
						/>
					</div>

				</div>
			</div>
		);
	}
}

const mapDispatchToProps = {
	sendMarkTest,
	setMarkTestRead,
	sendRemoveTest,
	setRemoveTestRead,
	requestMarkTest,
	requestRemoveClassTest,
	requestClassTests,
	requestModulesByDescipline,
	requestTeacherDisciplines
};

const mapStateToProps = (state) => {
	return {
		classes: state.classes.classes,
		tests: state.tests.tests,
		markTestRead: state.tests.markTestRead,
		teacherId: state.authentication.userRoleId,
		teacherDisciplines: state.disciplines.teacherDisciplines,
		roleEntityId: state.connect.user.roleEntityId,
		removeTest: state.tests.removeTest,
		modules: state.modules.modules,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MarkTest);
