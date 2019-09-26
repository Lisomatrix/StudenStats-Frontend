import React, { Component } from 'react';
import AbsenceGraph from './absences-graph';
import ModulesGraph from './modules-graph';
import GradesGraph from './grades-graph';
import HoursRecuperationGraph from './hours-recuperation-graph';
import { shallowEqual } from 'shouldcomponentupdate-children';

function getAbsencesRecuperatedCount(absences) {
	var recuperated = 0;
	var nonRecuperated = 0;

	for (var i = 0; i < absences.length; i++) {
		if (absences[i].recuperated) {
			recuperated++;
		} else {
			nonRecuperated++;
		}
	}

	return { recuperated, nonRecuperated };
}

function getAbsenceJustifiedCount(absences) {
	var justified = 0;
	var nonJustified = 0;

	for (var i = 0; i < absences.length; i++) {
		if (absences[i].justified) {
			justified++;
		} else {
			nonJustified++;
		}
	}

	return { justified, nonJustified };
}

function getModuleGradesCount(moduleGrades) {
	var passed = 0;
	var nonPassed = 0;

	for (var i = 0; i < moduleGrades.length; i++) {
		if (moduleGrades[i].moduleGrade > 9) {
			passed++;
		} else {
			nonPassed++;
		}
	}

	return { passed, nonPassed };
}

function getModule(moduleId, modules, disciplineId) {

	for (var i = 0; i < modules.length; i++) {
		if (disciplineId) {
			if (modules[i].moduleId === moduleId && modules[i].disciplineId === disciplineId) {
				return modules[i];
			}
		} else {
			if (modules[i].moduleId === moduleId) {
				return modules[i];
			}
		}
	}

	return NaN;
}

function getGradesValues(moduleId, moduleGrades) {
	var smallest = 999;
	var biggest = -999;
	var median = 0;
	var total = 0;
	var ocurrences = 0;

	for (var i = 0; i < moduleGrades.length; i++) {
		if (moduleGrades[i].moduleId === moduleId) {
			total += moduleGrades[i].moduleGrade;
			ocurrences++;

			if (moduleGrades[i].moduleGrade < smallest) {
				smallest = moduleGrades[i].moduleGrade;
			}

			if (moduleGrades[i].moduleGrade > biggest) {
				biggest = moduleGrades[i].moduleGrade;
			}
		}
	}

	median = (total / ocurrences).toFixed(1);

	return { smallest, biggest, median };
}

function getModuleGradesData(moduleGrades, modules, disciplineId) {
	const data = [];

	for (var i = 0; i < moduleGrades.length; i++) {
		var same = false;
		if (data.length > 0) {
			for (var x = 0; x < data.length; x++) {
				if (data[x].moduleId === moduleGrades[i].moduleId) {
					same = true;
				}
			}
		}

		if (!same) {
			const foundModule = getModule(moduleGrades[i].moduleId, modules, disciplineId);
			const gradesValue = getGradesValues(moduleGrades[i].moduleId, moduleGrades);

			if (foundModule != NaN && foundModule.name !== undefined) {
				data.push({
					moduleId: foundModule.moduleId,
					month: foundModule.name,
					'Mínima': gradesValue.smallest,
					'Média': gradesValue.median,
					'Máxima': gradesValue.biggest
				});
			}
		} else {
			same = false;
		}
	}

	return data;
}

class ClassStatus extends Component {

	state = {
		selectedDiscipline: null
	}

	componentWillUpdate(nextProps, nextState) {
		const { selectedDiscipline } = nextState;
		const { disciplines } = nextProps;

		if (!selectedDiscipline && disciplines && disciplines.length > 0)  {
            nextState.selectedDiscipline = disciplines[0].disciplineId;
        }
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		const { absences, moduleGrades, modules, disciplines } = this.props;
		const { selectedDiscipline } = this.state;

		var data = [];

		var justified = {
			justified: 0,
			nonJustified: 0
		};

		var recuperated = {
			recuperated: 0,
			nonRecuperated: 0
		};

		var passed = {
			passed: 0,
			nonPassed: 0
		};

		if (absences) {
			recuperated = getAbsencesRecuperatedCount(absences);
			justified = getAbsenceJustifiedCount(absences);
		}

		if (moduleGrades) {
			passed = getModuleGradesCount(moduleGrades);
		}

		if (window.innerWidth > 500) {
			if (moduleGrades && modules) {
				let disciplineFilter = selectedDiscipline;

				if (!selectedDiscipline && disciplines && disciplines.length > 0) {
					disciplineFilter = disciplines[0].disciplineId;
				}

				data = getModuleGradesData(moduleGrades, modules, disciplineFilter);
			}
		}

		return (
			<div className="class-management-container animated slideInUp">
				<div className="class-name-container">
					<h1 style={{ margin: '0' }}>{this.props.name}</h1>
				</div>
				<div className="graphs-container">
					<AbsenceGraph
						nonJustified={justified.nonJustified}
						justified={justified.justified}
						primaryColor={this.props.primaryColor}
					/>
					<HoursRecuperationGraph
						nonRecuperated={recuperated.nonRecuperated}
						recuperated={recuperated.recuperated}
						primaryColor={this.props.primaryColor}
					/>
					<ModulesGraph
						passed={passed.passed}
						nonPassed={passed.nonPassed}
						primaryColor={this.props.primaryColor}
					/>
				</div>

				<GradesGraph
					selectedDiscipline={this.state.selectedDiscipline}
					onDisciplinesChange={(value) => this.setState({ selectedDiscipline: value })}
					disciplines={this.props.disciplines}
					propData={data}
				/>
			</div>
		);
	}
}

export default ClassStatus;
