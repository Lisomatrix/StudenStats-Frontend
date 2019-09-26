import React from "react";
import { shallowEqual } from "shouldcomponentupdate-children";
import { connect } from "react-redux";
import "./../../../styles/modules-management.less";
import {
  Select,
  InputNumber,
  Switch,
  Table,
  Avatar,
  Icon,
  Button,
  Modal,
  message
} from "antd";
import { requestClassTests } from "./../../../redux/actions/restActions/test";
import { requestModulesByDescipline } from "./../../../redux/actions/restActions/module";
import {
  requestTestGrades,
  requestUpdateTestGrades,
  requestClassModuleGrades,
  requestUpdateModuleGrades,
  requestClassAndModuleTestGrades
} from "./../../../redux/actions/restActions/grade";
import { requestTeacherDisciplines } from "./../../../redux/actions/restActions/discipline";
import { Prompt } from "react-router-dom";

const Option = Select.Option;

class ModulesManagement extends React.Component {
  columns = [
    {
      title: "Foto",
      dataIndex: "face",
      width: "10%",
      key: "face",
      render: (text, row, index) => {
        const isPhoto = text !== "user";

        return (
          <button className="reset-btn" id={row.key}>
            {isPhoto ? (
              <Avatar id={row.key} className="icon" size="user" src={text} />
            ) : (
                <Avatar id={row.key} className="icon" size="user" icon="user" />
              )}
          </button>
        );
      }
    },
    {
      title: "Nome",
      dataIndex: "name",
      width: "60%",
      key: "name",
      render: (text, row, index) => <a href="javascript:;">{text}</a>
    },
    {
      title: "Nota",
      dataIndex: "grade",
      width: "15%",
      key: "grade",
      render: (text, row, index) => {
        if (this.state.editMode) {
          return (
            <InputNumber
              onChange={value => this._updateStudentModuleGrade(row.id, value)}
              min={0}
              max={20}
              defaultValue={0}
              value={text}
            />
          );
        } else {
          return <span>{text}</span>;
        }
      }
    },
    {
      title: "Média dos Testes",
      dataIndex: "tests",
      key: "tests",
      width: "15%",
      render: (text, row, index) => {
        return <span>{text}</span>;
      }
    }
  ];

  state = {
    getStudentsLoading: false,
    getDisciplineLoading: false,
    getModuleLoading: false,
    getTestLoading: false,
    selectedClass: null,
    selectedDiscipline: null,
    selectedModule: null,
    selectedTest: null,
    data: [],
    editMode: false,
    edited: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowEqual(this.props, nextProps, this.state, nextState);
  }

  _saveStudentModuleGrades = () => {
    const newData = [];

    for (var i = 0; i < this.state.data.length; i++) {
      newData.push({
        moduleGrade: this.state.data[i].grade,
        studentId: this.state.data[i].id
      });
    }

    this.props
      .requestUpdateModuleGrades(newData, this.state.selectedModule)
      .then(() => {
        message.success("Notas guardadas");
        this.forceUpdate();
      });

    this.setState({ edited: false, editMode: false });
  };

  _updateStudentModuleGrade = (studentId, grade) => {
    const newdata = [];

    for (var i = 0; i < this.state.data.length; i++) {
      const tempRow = this.state.data[i];

      if (tempRow.id === studentId) {
        tempRow.grade = grade;
      }

      newdata.push(tempRow);
    }

    this.setState({ data: newdata, edited: true });
  };

  _getStudentModuleGrade = (
    studentId,
    moduleGrades,
    currentData,
    edited,
    selectedModule
  ) => {
    if (edited)
      if (currentData && currentData.length > 0) {
        for (var i = 0; i < currentData.length; i++) {
          if (currentData[i].id === studentId) {
            return currentData[i].grade;
          }
        }
      }

    if (moduleGrades) {
      for (var i = 0, n = moduleGrades.length; i < n; i++) {

        if (
          moduleGrades[i].studentId === studentId &&
          moduleGrades[i].moduleId === selectedModule
        ) {
          return moduleGrades[i].moduleGrade;
        }
      }
    }

    return 0;
  };

  _handleClassChange = value => {
    if (!this._hasClassTests()) {
      const promise = this.props.requestClassTests(value);

      if (promise) {
        promise.then(() => {
          this.setState({ getTestLoading: false });
        });
      }
    }

    this._confirmSelectChange({
      selectedClass: value,
      selectedDiscipline: null,
      selectedModule: null,
      getStudentsLoading: true,
      data: [],
      edited: false
    });
  };

  _handleModuleChange = value => {
    if (!this._hasClassModuleGrades(value)) {
      this.props.requestClassModuleGrades(this.state.selectedClass);
      this.props.requestClassAndModuleTestGrades(
        this.state.selectedClass,
        value
      );
    }

    this._confirmSelectChange({
      selectedModule: value,
      getTestLoading: true,
      data: [],
      edited: false
    });
  };

  _handleDisciplineChange = value => {
    if (!this._hasDisciplineModules()) {
      this.props.requestModulesByDescipline(value).then(() => {
        this.setState({ getModuleLoading: false });
      });
    }

    this._confirmSelectChange({
      selectedDiscipline: value,
      selectedModule: null,
      selectedTest: null,
      getModuleLoading: true,
      data: [],
      edited: false
    });
  };

  _hasClassTests = () => {
    if (this.props.tests) {
      for (var i = 0; i < this.props.tests; i++) {
        if (this.props.tests[i].classId === this.state.selectedClass) {
          return true;
        }
      }
    }

    return false;
  };

  _hasClassModuleGrades = value => {
    if (this.props.moduleGrades) {
      for (var i = 0; i < this.props.moduleGrades.length; i++) {
        if (this.props.moduleGrades[i].moduleId === value) {
          return true;
        }
      }
    }

    return false;
  };

  _hasDisciplineModules = () => {
    if (this.props.modules) {
      for (var i = 0; i < this.props.modules.length; i++) {
        if (
          this.props.modules[i].disciplineId === this.state.selectedDiscipline
        ) {
          return true;
        }
      }
    }

    return false;
  };

  _getSelectedDiscipline = disciplineId => {
    for (var i = 0; i < this.props.teacherDisciplines.length; i++) {
      if (this.props.teacherDisciplines[i].disciplineId === disciplineId) {
        return this.props.teacherDisciplines[i];
      }
    }
  };

  _confirmRouteChange = nextLocation => {
    if (this.state.edited) {
      Modal.confirm({
        title: "Alterações nāo guardadas!",
        content: "As alterações não foram guardadas pretende sair mesmo assim?",
        onOk() {
          this.props.history.push(nextLocation.pathname);
        },
        okText: "Não guardar",
        okButtonProps: { type: "danger" }
      });

      return false;
    }

    return true;
  };

  _confirmSelectChange = stateChanges => {
    if (this.state.edited) {
      Modal.confirm({
        title: "Alterações nāo guardadas!",
        content: "As alterações não foram guardadas pretende guardá-las agora?",
        onOk: () => {
          this._saveStudentModuleGrades();
          this.setState(stateChanges);
        },
        onCancel: () => {
          this.setState(stateChanges);
        },
        okText: "Guardar",
        okButtonProps: { type: "primary" },
        cancelText: "Não Guardar",
        cancelButtonProps: { type: "danger" }
      });
    } else {
      this.setState(stateChanges);
    }
  };

  _generateRow = (
    student,
    moduleGrades,
    currentData,
    edited,
    selectedModule
  ) => {
    const tests = this._getStudentModuleTestGrades(student.studentId);

    return {
      key: student.studentId,
      name: student.name,
      id: student.studentId,
      face: student.photo ? student.photo : "user",
      grade: this._getStudentModuleGrade(
        student.studentId,
        moduleGrades,
        currentData,
        edited,
        selectedModule
      ),
      tests: isNaN(tests) ? "0" : tests.toString()
    };
  };

  _getStudentModuleTestGrades = studentId => {
    const tests = this._getModuleTests(this.state.selectedModule);
    const testGrades = this._getTestsGrades(tests);

    const studentTestGrades = [];

    for (var i = 0; i < testGrades.length; i++) {
      if (testGrades[i].studentId === studentId) {
        studentTestGrades.push(testGrades[i]);
      }
    }

    var total = 0;

    for (var i = 0; i < studentTestGrades.length; i++) {
      total += studentTestGrades[i].grade;
    }

    return total / studentTestGrades.length;
  };

  _getModuleTests = moduleId => {
    const tests = [];

    if (this.props.tests) {
      for (var i = 0; i < this.props.tests.length; i++) {
        if (this.props.tests[i].moduleId === moduleId) {
          tests.push(this.props.tests[i]);
        }
      }
    }

    return tests;
  };

  _getTestsGrades = tests => {
    const testGrades = [];

    if (this.props.testGrades)
      for (var i = 0; i < tests.length; i++) {
        for (var x = 0; x < this.props.testGrades.length; x++) {
          if (tests[i].testId === this.props.testGrades[x].testId) {
            testGrades.push(this.props.testGrades[x]);
          }
        }
      }

    return testGrades;
  };

  componentWillMount() {
    if (!this.props.teacherDisciplines) {
      this.props.requestTeacherDisciplines();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    var hasClassTests = false;
    var hasDisciplineModules = false;

    if (this._hasClassTests()) {
      hasClassTests = true;
    }

    if (this._hasDisciplineModules()) {
      hasDisciplineModules = true;
    }

    nextState.getModuleLoading = !hasDisciplineModules;
    nextState.getTestLoading = !hasClassTests;

    const rows = [];

    var foundClass;

    if (nextProps.classes && nextState.selectedClass) {
      for (var i = 0; i < nextProps.classes.length; i++) {
        if (nextProps.classes[i].classId === nextState.selectedClass) {
          foundClass = nextProps.classes[i];
          break;
        }
      }
    }

    if (nextState.selectedClass && foundClass) {

      for (var i = 0; i < foundClass.students.length; i++) {
        const studentRow = this._generateRow(
          foundClass.students[i],
          nextProps.moduleGrades,
          nextState.data,
          nextState.edited,
          nextState.selectedModule
        );

        rows.push(studentRow);
      }

      nextState.data = rows;
    }
  }

  render() {
    var avaibleClasses;
    var avaibleDisciplines;
    var avaibleModules;

    if (this.props.classes) {
      avaibleClasses = this.props.classes.map(item => {
        return (
          <Option key={item.classId} value={item.classId}>
            {item.name}
          </Option>
        );
      });
    }

    if (this.props.teacherDisciplines) {
      avaibleDisciplines = this.props.teacherDisciplines.map(item => {
        return (
          <Option key={item.disciplineId} value={item.disciplineId}>
            {item.abbreviation}
          </Option>
        );
      });
    }

    if (this.props.modules) {
      avaibleModules = this.props.modules.map(item => {
        if (item.disciplineId === this.state.selectedDiscipline)
          return (
            <Option key={item.moduleId} value={item.moduleId}>
              {item.name}
            </Option>
          );
      });
    }

    return (
      <div className="modules-management-container">
        <Prompt when={this.state.edited} message={this._confirmRouteChange} />
        <div className="ant-card-bordered modules-management animated slideInUp">
          <div className="modules-management-options-container">
            <div className="select-margin">
              <label>Turma:</label>
              <Select
                value={
                  this.state.selectedClass
                    ? this.state.selectedClass
                    : undefined
                }
                onChange={this._handleClassChange}
                className="select"
                placeholder="Turma"
              >
                {avaibleClasses}
              </Select>
            </div>
            <div className="select-margin">
              <label>Disciplina:</label>
              <Select
                value={
                  this.state.selectedDiscipline
                    ? this.state.selectedDiscipline
                    : undefined
                }
                onChange={this._handleDisciplineChange}
                placeholder={
                  this.state.getDisciplineLoading ? (
                    <Icon type="loading" theme="outlined" />
                  ) : (
                      "Disciplina"
                    )
                }
              >
                {avaibleDisciplines}
              </Select>
            </div>
            <div className="select-margin">
              <label>Módulo/UFCD:</label>
              <Select
                value={
                  this.state.selectedModule
                    ? this.state.selectedModule
                    : undefined
                }
                onChange={this._handleModuleChange}
                placeholder={
                  /*this.state.getModuleLoading ? <Icon type="loading" theme="outlined" /> :*/ "Módulo/UFCD"
                }
              >
                {avaibleModules}
              </Select>
            </div>

            <div className="edit-btn">
              <label>Editar:</label>
              <Switch
                className="edit-switch"
                checked={this.state.editMode}
                onChange={() =>
                  this.setState({ editMode: !this.state.editMode })
                }
              />
            </div>
            <div style={{ width: "100%", visibility: "hidden" }}>&</div>
            <div className="save-btn-container">
              <Button className="save-btn" onClick={this._saveStudentModuleGrades} type="primary">
                Guardar
              </Button>
            </div>
          </div>

          <div className="modules-management-content-container">
            <Table
              columns={this.columns}
              dataSource={this.state.data}
              style={{
                marginLeft: "5px",
                marginRight: "5px"
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  requestClassTests,
  requestModulesByDescipline,
  requestTestGrades,
  requestUpdateTestGrades,
  requestClassModuleGrades,
  requestUpdateModuleGrades,
  requestClassAndModuleTestGrades,
  requestTeacherDisciplines
};

const mapStateToProps = state => {
  return {
    classes: state.classes.classes,
    students: state.students.students,
    teacherDisciplines: state.disciplines.teacherDisciplines,
    modules: state.modules.modules,
    tests: state.tests.tests,
    teacherId: state.authentication.userRoleId,
    testGrades: state.grades.testGrades,
    moduleGrades: state.modules.moduleGrades
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModulesManagement);
