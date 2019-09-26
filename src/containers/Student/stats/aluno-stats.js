import React, { Component } from "react";
import { connect } from "react-redux";
import AbsenceCard from "./../../../components/stats-components/absence";
import NextTest from "./../../../components/stats-components/next-test";
import UserInfo from "./../../../components/stats-components/user-info";
import MarkedTests from "./../../../components/stats-components/marked-tests";
import { shallowEqual } from "shouldcomponentupdate-children";
import "./../../../styles/aluno-stats.less";
import { requestStudentAbsences } from "./../../../redux/actions/restActions/absence";
import { requestClassTests } from "./../../../redux/actions/restActions/test";
import { requestStudentClass } from "./../../../redux/actions/restActions/class";
import { requestClassDisciplines } from "./../../../redux/actions/restActions/discipline";
import { requestModulesByClass } from "./../../../redux/actions/restActions/module";
import { requestStudentModuleGrades } from "./../../../redux/actions/restActions/grade";
import GradesGraph from "./../../../components/class-management-components/grades-graph";

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
      if (
        modules[i].moduleId === moduleId &&
        modules[i].disciplineId === disciplineId
      ) {
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
      const foundModule = getModule(
        moduleGrades[i].moduleId,
        modules,
        disciplineId
      );
      const gradesValue = getGradesValues(
        moduleGrades[i].moduleId,
        moduleGrades
      );

      if (foundModule != NaN && foundModule.name !== undefined) {
        data.push({
          moduleId: foundModule.moduleId,
          month: foundModule.name,
          Mínima: gradesValue.smallest,
          Média: gradesValue.median,
          Máxima: gradesValue.biggest
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
      if (
        !absences[i].justified &&
        absences[i].justifiable &&
        !absences[i].recuperated
      ) {
        filteredAbsences.push(absences[i]);
      }
    }
  }

  return filteredAbsences;
}

function filterUnjustifiedAbsences(absences) {
  const filteredAbsences = [];

  if (absences) {
    for (var i = 0; i < absences.length; i++) {
      if (
        !absences[i].justified &&
        absences[i].justifiable &&
        !absences[i].recuperated
      ) {
        filteredAbsences.push(absences[i]);
      }
    }
  }

  return filteredAbsences;
}

var dataFetched = false;
var testsFetched = false;

class AlunoStats extends Component {
  state = {
    selectedDiscipline: null
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.studentClass && !dataFetched) {
      nextProps.requestStudentAbsences();
      nextProps.requestClassTests(nextProps.studentClass.classId);

      dataFetched = true;
    }

    if (nextProps.studentClass && !nextProps.disciplines) {
      nextProps.requestModulesByClass(nextProps.studentClass.classId);
      nextProps.requestClassDisciplines(nextProps.studentClass.classId);
    }

    if (!testsFetched && nextProps.students) {
      nextProps.requestStudentModuleGrades();

      testsFetched = true;
    }

    const { selectedDiscipline } = nextState;
    const { disciplines } = nextProps;

    if (!selectedDiscipline && disciplines && disciplines.length > 0) {
      nextState.selectedDiscipline = disciplines[0].disciplineId
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowEqual(this.props, nextProps, this.state, nextState);
  }

  render() {
    var data = [];

    if (window.innerWidth > 500) {
      if (this.props.moduleGrades && this.props.modules) {
        data = getModuleGradesData(
          this.props.moduleGrades,
          this.props.modules,
          this.state.selectedDiscipline
        );
      }
    }

    var absenceNumber;

    if (this.props.absences) {
      const filteredAbsences = filterUnjustifiedAbsences(this.props.absences);
      absenceNumber = filteredAbsences.length;
    } else {
      absenceNumber = 0;
    }

    return (
      <div className="stats-container">
        <div className="cards-container animated slideInDown">
          <UserInfo
            image="https://cdn.discordapp.com/avatars/313010829790412800/57e7c5d16250f158d483b4c1869844b7.png?size=128"
            name="Tiago Lima"
          />
          <AbsenceCard absencesNumber={absenceNumber} />
          <MarkedTests tests={this.props.tests ? this.props.tests.length : 0} />
          <NextTest tests={this.props.tests} />
        </div>
        {window.innerWidth > 500 ? (
          <div className="grades-container animated slideInUp">
            <GradesGraph
              singleLine={true}
              onDisciplinesChange={value =>
                this.setState({ selectedDiscipline: value })
              }
              disciplines={this.props.disciplines}
              propData={data}
              selectedDiscipline={this.state.selectedDiscipline}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    absences: state.absences.absences,
    tests: state.tests.tests,
    studentClass: state.classes.studentClass,
    disciplines: state.disciplines.classDisciplines,
    modules: state.modules.modules,
    moduleGrades: state.modules.moduleGrades
  };
};

const mapDispatchToProps = {
  requestStudentAbsences,
  requestClassTests,
  requestStudentModuleGrades,
  requestModulesByClass,
  requestClassDisciplines,
  requestStudentClass
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlunoStats);
