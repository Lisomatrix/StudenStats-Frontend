import React from "react";
import { connect } from "react-redux";
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
import "./../../../styles/grade-management.less";
import { requestClassTests } from "./../../../redux/actions/restActions/test";
import { requestModulesByDescipline } from "./../../../redux/actions/restActions/module";
import {
  requestTestGrades,
  requestUpdateTestGrades
} from "./../../../redux/actions/restActions/grade";
import { requestTeacherDisciplines } from "./../../../redux/actions/restActions/discipline";
import { Prompt } from "react-router-dom";

const Option = Select.Option;

class GradeManagement extends React.Component {
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
      width: "70%",
      key: "name",
      render: (text, row, index) => <a href="javascript:;">{text}</a>
    },
    {
      title: "Nota",
      dataIndex: "grade",
      width: "20%",
      key: "grade",
      render: (text, row, index) => {
        if (this.state.editMode) {
          return (
            <InputNumber
              onChange={value => this._updateStudentTestGrade(row.id, value)}
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

  _saveStudentTestGrades = () => {
    const { data, selectedTest } = this.state;
    const { requestUpdateTestGrades } = this.props;

    const newData = [];

    for (var i = 0; i < data.length; i++) {
      newData.push({
        grade: data[i].grade,
        studentId: data[i].id,
        testId: selectedTest
      });
    }

    requestUpdateTestGrades(newData, selectedTest)
      .then(() => {
        message.success("Notas guardadas");
        this.forceUpdate();
      });

    this.setState({ edited: false, editMode: false });
  };

  _updateStudentTestGrade = (studentId, grade) => {
    const { data } = this.state;
    const newdata = [];

    for (var i = 0; i < data.length; i++) {
      const tempRow = data[i];

      if (tempRow.id === studentId) {
        tempRow.grade = grade;
      }

      newdata.push(tempRow);
    }

    this.setState({ data: newdata, edited: true });
  };

  _hasClassTests = () => {
    const { tests } = this.props;
    const { selectedClass } = this.state;

    if (tests) {
      for (var i = 0; i < tests; i++) {
        if (tests[i].classId === selectedClass) {
          return true;
        }
      }
    }

    return false;
  };

  _hasDisciplineModules = () => {
    const { modules } = this.props;
    const { selectedDiscipline } = this.state;

    if (modules) {
      for (var i = 0; i < modules.length; i++) {
        if (
          modules[i].disciplineId === selectedDiscipline
        ) {
          return true;
        }
      }
    }

    return false;
  };

  _getSelectedDiscipline = disciplineId => {
    const { teacherDisciplines } = this.props;

    for (var i = 0; i < teacherDisciplines.length; i++) {
      if (teacherDisciplines[i].disciplineId === disciplineId) {
        return teacherDisciplines[i];
      }
    }
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
      selectedTest: null,
      getStudentsLoading: true,
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

  _handleModuleChange = value => {
    this._confirmSelectChange({
      selectedModule: value,
      selectedTest: null,
      getTestLoading: true,
      data: [],
      edited: false
    });
  };

  _handleTestChange = value => {
    this.props.requestTestGrades(value).then(() => {
      this.setState({ getTestLoading: false });
    });

    this._confirmSelectChange({ selectedTest: value, data: [], edited: false });
  };

  _getStudentTestGrade = (
    studentId,
    testGrades,
    currentData,
    edited,
    selectedTest
  ) => {
    if (edited)
      if (currentData && currentData.length > 0) {
        for (let i = 0; i < currentData.length; i++) {
          if (currentData[i].id === studentId) {
            return currentData[i].grade;
          }
        }
      }

    if (testGrades) {
      for (let i = 0; i < testGrades.length; i++) {
        if (
          testGrades[i].studentId === studentId &&
          testGrades[i].testId === selectedTest
        ) {
          return testGrades[i].grade;
        }
      }
    }

    return 0;
  };

  _generateRow = (student, testGrades, currentData, edited, selectedTest) => {
    return {
      key: student.studentId,
      name: student.name,
      id: student.studentId,
      face: student.photo ? student.photo : "user",
      grade: this._getStudentTestGrade(
        student.studentId,
        testGrades,
        currentData,
        edited,
        selectedTest
      )
    };
  };

  _confirmSelectChange = stateChanges => {
    if (this.state.edited) {
      Modal.confirm({
        title: "Alterações nāo guardadas!",
        content: "As alterações não foram guardadas pretende guardá-las agora?",
        onOk: () => {
          this._saveStudentTestGrades();
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

  componentWillMount() {
    if (!this.props.teacherDisciplines) {
      this.props.requestTeacherDisciplines();
    }
  }

  componentDidMount() {
    this.forceUpdate();
  }

  componentWillUpdate(nextProps, nextState) {
    const { classes } = nextProps;
    const { selectedClass } = nextState;

    let hasClassTests = false;
    let hasDisciplineModules = false;

    if (this._hasClassTests()) {
      hasClassTests = true;
    }

    if (this._hasDisciplineModules()) {
      hasDisciplineModules = true;
    }

    nextState.getModuleLoading = !hasDisciplineModules;
    nextState.getTestLoading = !hasClassTests;

    const rows = [];

    let foundClass;

    if (classes && selectedClass) {
      for (let i = 0; i < classes.length; i++) {
        if (classes[i].classId === selectedClass) {
          foundClass = classes[i];
          break;
        }
      }
    }

    if (selectedClass && foundClass) {
      for (let i = 0; i < foundClass.students.length; i++) {
        const studentRow = this._generateRow(
          foundClass.students[i],
          nextProps.testGrades,
          nextState.data,
          nextState.edited,
          nextState.selectedTest
        );

        rows.push(studentRow);
      }
      console.log(nextState.data);
      console.log(rows);
      nextState.data = rows;
    }
  }

  render() {
    var avaibleClasses;
    var avaibleDisciplines;
    var avaibleModules;
    var avaibleTests;

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

    if (this.props.tests && this.props.teacherDisciplines) {
      const selectedDiscipline = this._getSelectedDiscipline(
        this.state.selectedDiscipline
      );

      if (selectedDiscipline)
        avaibleTests = this.props.tests.map(item => {
          if (
            item.classId === this.state.selectedClass &&
            item.teacherId === this.props.teacherId &&
            item.discipline === selectedDiscipline.name &&
            item.moduleId === this.state.selectedModule
          ) {
            return (
              <Option key={item.testId} value={item.testId}>
                {item.date}
              </Option>
            );
          }
        });
    }

    return (
      <div className="grade-management-container">
        <Prompt when={this.state.edited} message={this._confirmRouteChange} />
        <div className="ant-card-bordered grade-management animated slideInUp">
          <div className="grade-management-options-container">
            <div
              className="select-margin"
              style={{ display: "flex", flexFlow: "column" }}
            >
              <label>Turma:</label>
              <Select
                value={
                  this.state.selectedClass
                    ? this.state.selectedClass
                    : undefined
                }
                onChange={this._handleClassChange}
                placeholder="Turma"
              >
                {avaibleClasses}
              </Select>
            </div>
            <div
              className="select-margin"
              style={{ display: "flex", flexFlow: "column" }}
            >
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
            <div
              className="select-margin"
              style={{ display: "flex", flexFlow: "column" }}
            >
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
            <div
              className="select-margin"
              style={{ display: "flex", flexFlow: "column" }}
            >
              <label>Teste:</label>
              <Select
                value={
                  this.state.selectedTest ? this.state.selectedTest : undefined
                }
                onChange={this._handleTestChange}
                placeholder={
                  /*this.state.getTestLoading ? <Icon type="loading" theme="outlined" /> :*/ "Teste"
                }
              >
                {avaibleTests}
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
              <Button className="save-btn" onClick={this._saveStudentTestGrades} type="primary">
                Guardar
              </Button>
            </div>
          </div>
          <div className="grade-management-content-container">
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
    testGrades: state.grades.testGrades
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GradeManagement);
