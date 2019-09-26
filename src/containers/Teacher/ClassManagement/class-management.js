import React, { Component } from 'react';
import './../../../styles/class-management.less';
import { connect } from 'react-redux';
import ClassStatus from './../../../components/class-management-components/status-subcontainer';
import AbsenceList from './../../../components/class-management-components/absences-subcontainer';
import Loading from './../../Neutral/loading/loading';
import { withRouter, Route, Switch } from 'react-router-dom';
import './../../../styles/class-management.less';
import { shallowEqual } from 'shouldcomponentupdate-children';
import { requestClassAbsences, requestAbsenceTypes, requestJustifyAbsence, requestRecuperateAbsence } from './../../../redux/actions/restActions/absence';
import { requestGetClasses } from './../../../redux/actions/restActions/class';
import { requestModulesByClass } from './../../../redux/actions/restActions/module';
import { requestClassModuleGrades } from './../../../redux/actions/restActions/grade';
import { requestClassDisciplines } from './../../../redux/actions/restActions/discipline';

function getTeacherClass(classes, teacherId) {
	if (classes && teacherId) {
		for (var i = 0; i < classes.length; i++) {
			if (classes[i].classDirectorId === teacherId) {
				return classes[i];
			}
		}
	}
}

var dataFetched = false;

class ClassManagement extends Component {
	state = {
		class: undefined,
		initialFetch: false
	};

	componentWillMount() {
		const { classes, teacherId } = this.props;

		if (classes && teacherId) {
			const teacherClass = getTeacherClass(classes, teacherId);

			if (teacherClass) {
				this.props.requestClassModuleGrades(teacherClass.classId);

				this.setState({ class: teacherClass });
			}
		}
	}

	componentWillReceiveProps(nextprops) {
		const { absences, requestClassAbsences } = nextprops;

		if (!absences && this.state.class) {
			requestClassAbsences();
		}
	}

	componentWillUpdate(nextProps, nextState) {
		const { modules, classDisciplines } = nextProps;

		if (!modules && nextState.class) {
			nextProps.requestModulesByClass(nextState.class.classId);
		}


		if (!classDisciplines && nextState.class) {
			nextProps.requestClassDisciplines(nextState.class.classId);
		}

		if (!dataFetched && nextState.class) {

			nextProps.requestClassDisciplines(nextState.class.classId);
			nextProps.requestClassModuleGrades(nextState.class.classId);
			nextProps.requestModulesByClass(nextState.class.classId);

			dataFetched = true;
		}

		if (!nextState.initialFetch) {
			this.requestNeededData(nextProps);

			nextState.initialFetch = true;
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	requestNeededData = (nextProps) => {
		const { absenceTypes, classDisciplines, classes, moduleGrades, modules } = nextProps;
		const { classId } = this.state.class;

		if (!absenceTypes) {
			nextProps.requestAbsenceTypes();
		}

		if (!classDisciplines && this.state.class) {
			nextProps.requestClassDisciplines(classId);
		}

		if (!classes) {
			nextProps.requestGetClasses();
		}

		if (!moduleGrades && this.state.class) {
			nextProps.requestClassModuleGrades(classId);
		}

		if (!modules && this.state.class) {
			nextProps.requestModulesByClass(classId);
		}
	}

	render() {
		return (
			<div className="container-size">
				{this.state.initialFetch ?
					<Switch>
						<Route
							path={`${this.props.match.path}/performance`}
							render={() => (
								<ClassStatus
									disciplines={this.props.classDisciplines}
									absences={this.props.absences}
									name={this.state.class ? this.state.class.name : ''}
									tests={this.props.tests}
									modules={this.props.modules}
									moduleGrades={this.props.moduleGrades}
									primaryColor={this.props.primaryColor}
								/>
							)}
						/>
						<Route
							path={`${this.props.match.path}/absences`}
							render={() => (
								<AbsenceList
									disciplines={this.props.classDisciplines}
									name={this.state.class ? this.state.class.name : ''}
									absences={this.props.absences}
									class={this.state.class}
									absenceTypes={this.props.absenceTypes}
									sendJustify={this.props.requestJustifyAbsence}
									sendRecuperate={this.props.requestRecuperateAbsence}
								/>
							)}
						/>
					</Switch>
					: <Loading text="A buscar dados" />}
			</div>
		);
	}
}

const mapDispatchToProps = {
	requestClassAbsences,
	requestAbsenceTypes,
	requestGetClasses,
	requestModulesByClass,
	requestClassModuleGrades,
	requestClassDisciplines,
	requestJustifyAbsence,
	requestRecuperateAbsence
};

const mapStateToProps = (state) => {
	return {
		classes: state.classes.classes,
		teacherId: state.authentication.userRoleId,
		absences: state.absences.classAbsences,
		absenceTypes: state.absences.absenceTypes,
		tests: state.tests.tests,
		modules: state.modules.modules,
		moduleGrades: state.modules.moduleGrades,
		storageReady: state.connect.storageReady,
		primaryColor: state.theme.primaryColor,
		teacherDisciplines: state.disciplines.teacherDisciplines,
		classDisciplines: state.disciplines.classDisciplines
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClassManagement));
