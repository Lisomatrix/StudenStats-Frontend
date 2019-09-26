import React from 'react';
import { connect } from 'react-redux';
import './../../../styles/child-status.less';
import './../../../styles/absence.less';
import { shallowEqual } from 'shouldcomponentupdate-children';
import AbsenceCard from './../../../components/stats-components/absence';
import MarkedTests from './../../../components/stats-components/marked-tests';
import NextTest from './../../../components/stats-components/next-test';
import { requestParentAbsences } from './../../../redux/actions/restActions/absence';
import { requestChildTests } from './../../../redux/actions/restActions/test';
import { requestChildClass } from './../../../redux/actions/restActions/class';
import { requestClassDisciplines } from './../../../redux/actions/restActions/discipline';
import { requestModulesByClass } from './../../../redux/actions/restActions/module';
import { requestChildModuleGrades } from './../../../redux/actions/restActions/grade';
import GradesGraph from './../../../components/class-management-components/grades-graph';

var dataFetched = false;
var testsFetched = false;

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

function filterByDiscipline(disciplineId, moduleGrades) {
    const filteredModuleGrades = [];

    for (var i = 0; i < moduleGrades.length; i++) {
        if (moduleGrades[i].disciplineId === disciplineId) {
            filteredModuleGrades.push(moduleGrades[i]);
        }
    }
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

function filterUnjustifiedAbsences(absences) {
    const filteredAbsences = [];

    if (absences) {
        for (var i = 0; i < absences.length; i++) {
            if (!absences[i].justified && absences[i].justifiable && !absences[i].recuperated) {
                filteredAbsences.push(absences[i]);
            }
        }
    }

    return filteredAbsences;
}

class ChildStatus extends React.Component {

    state = {
		selectedDiscipline: null
	}

    shouldComponentUpdate(nextProps, nextState) {
        return shallowEqual(this.props, nextProps, this.state, nextState);
    }

    componentWillMount() {
        if (!dataFetched) {
            this.props.requestParentAbsences();

            dataFetched = true;
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { selectedDiscipline } = nextState;
        const { disciplines, requestChildTests, requestChildModuleGrades, requestChildClass,
            students, requestClassDisciplines, requestModulesByClass
        } = nextProps;

        if (!testsFetched && students) {
            requestChildTests(students[0].studentId);
            requestChildModuleGrades(students[0].studentId);
            requestChildClass(students[0].studentId)
            .then((x) => {
                if(x) {
                    requestClassDisciplines(x.classId);
                    requestModulesByClass(x.classId);
                }
            });

            testsFetched = true;
        }

        if (!selectedDiscipline && disciplines && disciplines.length > 0)  {
            nextState.selectedDiscipline = disciplines[0].disciplineId;
        }
    }

    render() {
        const { selectedDiscipline } = this.state;
        const { absences, disciplines, moduleGrades, modules } = this.props;

        let data = [];

        if (window.innerWidth > 500) {
            if (moduleGrades && modules) {
                data = getModuleGradesData(moduleGrades, modules, selectedDiscipline);
            }
        }

        let absenceNumber;

        if (absences) {
            const filteredAbsences = filterUnjustifiedAbsences(absences);
            absenceNumber = filteredAbsences.length;
        } else {
            absenceNumber = 0;
        }

        let disciplineFilter = selectedDiscipline;

        if (!selectedDiscipline && disciplines && disciplines.length > 0) {
            disciplineFilter = disciplines[0].disciplineId;
        }

        return (
            <div className="child-status-container">
                <div className="child-status animated slideInDown">
                    <AbsenceCard absencesNumber={absenceNumber} />
                    <MarkedTests tests={this.props.tests ? this.props.tests.length : 0} />
                    <NextTest tests={this.props.tests ? this.props.tests : []} />
                </div>
                {window.innerWidth > 600 ? (<div className="child-status-graph-container animated slideInUp">
                    <GradesGraph
                        selectedDiscipline={disciplineFilter}
                        singleLine={true}
                        onDisciplinesChange={(value) => this.setState({ selectedDiscipline: value })}
                        disciplines={this.props.disciplines}
                        propData={data} />
                </div>) : ""}
            </div>
        );
    }
}

const mapDispatchToProps = {
    requestParentAbsences,
    requestChildTests,
    requestChildClass,
    requestClassDisciplines,
    requestModulesByClass,
    requestChildModuleGrades
};

const mapStateToProps = (state) => {
    return {
        tests: state.tests.tests,
        absences: state.absences.absences,
        students: state.students.parentStudents,
        disciplines: state.disciplines.classDisciplines,
        modules: state.modules.modules,
        moduleGrades: state.modules.moduleGrades,
        primaryColor: state.theme.primaryColor,
        studentClass: state.classes.studentClass
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChildStatus);