import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./../../../styles/admin-class-management.less";
import {
  requestAdminClasses,
  requestCourses,
  requestNewClass,
  requestRemoveClass,
  requestUpdateClass,
  requestStudentsPhotos,
  requestRemoveStudentToClassByStudentId,
  requestAddStudentToClassByStudentId
} from "./../../../redux/actions/restActions/class";
import { requestAdminStudents } from "./../../../redux/actions/restActions/student";
import {
  requestAdminTeachers,
  requestDirectorTeachers,
  requestFreeTeachers
} from "./../../../redux/actions/restActions/teacher";
import { Input, Select, AutoComplete, Button, message } from "antd";
import { isString } from "util";
import StudentsList from "./../../../components/admin-class-management-components/students-list";

const Option = Select.Option;

const years = [1, 2, 3];

var yearsOptions = [];

function findClass(classId, classes) {
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].classId === classId) {
      return classes[i];
    }
  }

  return null;
}

function findTeacher(teacherId, teachers) {
  for (var i = 0; i < teachers.length; i++) {
    if (teachers[i].teacherId === teacherId) {
      return teachers[i];
    }
  }

  return null;
}

function findCourseIdByName(name, courses) {
  if (courses) {
    for (var i = 0; i < courses.length; i++) {
      if (courses[i].name.trim().toLowerCase() === name.trim().toLowerCase()) {
        return courses[i].courseId;
      }
    }
  }

  return null;
}

class AdminClassManagement extends React.Component {
  state = {
    classId: this.props.match.params.id,
    class: null,
    selectedYear: null,
    selectedCourse: null,
    selectedTeacher: null,
    classTeacher: null,
    className: "",
    classDataLoaded: false,
    dataChanged: true
  };

  componentDidMount() {
    this.forceUpdate();
  }

  componentWillMount() {
    if (!this.props.classes) {
      this.props.requestAdminClasses().then(result => {
        if (result) {
          this.props.requestStudentsPhotos(result);
        }
      });
    }

    if (!this.props.courses) {
      this.props.requestCourses();
    }

    if (!this.props.students) {
      this.props.requestAdminStudents();
    }

    if (!this.props.teachers) {
      this.props.requestAdminTeachers();
    }

    if (!this.props.freeTeachers) {
      this.props.requestFreeTeachers();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (yearsOptions.length === 0) {
      yearsOptions = years.map(year => {
        return (
          <Option key={year} value={year}>
            {year}
          </Option>
        );
      });
    }

    if ((!nextState.class || nextState.dataChanged) && nextProps.classes) {
      nextState.class = findClass(
        parseInt(nextState.classId),
        nextProps.classes
      );

			if(nextState.class) {
				nextState.className = nextState.class.name;
			}
      nextState.dataChanged = false;
    }

    if (!nextState.classTeacher && nextProps.teachers && nextState.class) {
      nextState.classTeacher = findTeacher(
        nextState.class.classDirectorId,
        nextProps.teachers
      );

      nextState.selectedCourse = nextState.class.courseId;
      nextState.selectedYear = nextState.class.year;
      nextState.selectedTeacher = nextState.classTeacher.teacherId;
    }

    if (nextState.class && nextProps.courses && !nextState.classDataLoaded) {
      const newClass = nextState.class;

      const foundCourseId = findCourseIdByName(
        newClass.course,
        nextProps.courses
      );

      newClass.courseId = foundCourseId;

      nextState.selectedCourse = foundCourseId;
      nextState.class = newClass;
      nextState.classDataLoaded = true;
    }
  }

  _updateClass = () => {
    const {
      selectedYear,
      selectedTeacher,
      selectedCourse,
      className
    } = this.state;

    if (
      selectedCourse &&
      selectedTeacher &&
      selectedYear &&
      className &&
      this.state.class
    ) {
      this.props
        .requestUpdateClass(
          {
            name: className,
            courseId: selectedCourse,
            year: parseInt(selectedYear),
            teacherId: parseInt(selectedTeacher)
          },
          this.state.classId
        )
        .then(result => {
          if (result) {
            console.log(result);
            this.setState({ className: result.name }, () => {
              message.success("Alterações guardadas!");
            });
          } else {
            message.error("Ocurreu um erro ao atualizar a turma!");
          }
        });
    }
  };

  _removeStudent = studentId => {
    this.props
      .requestRemoveStudentToClassByStudentId(this.state.classId, studentId)
      .then(result => {
        if (result) {
          message.success("Aluno removido!");
          this.setState({ dataChanged: true });
        } else {
          message.error("Ocurreu um erro ao remover o aluno!");
        }
      });
  };

  _addStudent = studentId => {
    this.props
      .requestAddStudentToClassByStudentId(this.state.classId, studentId)
      .then(result => {
        if (result) {
          message.success("Aluno adicionado!");
          this.setState({ dataChanged: true });
        } else {
          message.error("Ocurreu um erro ao adicionar o aluno!");
        }
      });
  };

  render() {
    var availableCourses;
    var availableTeachers;
    var students;

    const selectableTeachers = this.props.freeTeachers
      ? this.props.freeTeachers
      : [];

    if (this.props.courses) {
      availableCourses = this.props.courses.map(item => {
        return (
          <Option key={item.courseId} value={item.courseId}>
            {item.name}
          </Option>
        );
      });
    }

    availableTeachers = selectableTeachers.map(item => {
      return (
        <Option key={item.teacherId} value={item.teacherId}>
          {item.name}
        </Option>
      );
    });

    if (this.props.students) {
      students = this.props.students.map(student => {
        if (student.classId === -1) {
          return (
            <AutoComplete.Option key={student.studentId} value={student.name}>
              {student.name}
            </AutoComplete.Option>
          );
        }
      });
    }

    return (
      <div className="admin-class-management-container">
        <div className="class-name-container">
          <h1 style={{ margin: "0" }}>
            {this.state.className ? this.state.className : ""}
          </h1>
        </div>
        <div className="ant-card-bordered admin-class-management animated slideInUp">
          <div className="class-edit-container">
            <div className="class-edit-container flex-row">
              <div
                style={{ width: "30%" }}
                className="class-edit-name-container flex-column"
              >
                <label>Nome:</label>
                <Input
                  placeholder="Nome da turma..."
                  value={this.state.className}
                  onChange={value =>
                    this.setState({ className: value.target.value })
                  }
                />
              </div>
              <div
                style={{ width: "10%" }}
                className="class-edit-year-container flex-column"
              >
                <label>Ano:</label>
                <Select
                  value={this.state.selectedYear}
                  onChange={value => this.setState({ selectedYear: value })}
                  placeholder="Ano..."
                >
                  {yearsOptions}
                </Select>
              </div>
              <div
                style={{ width: "35%" }}
                className="class-edit-course-container flex-column"
              >
                <label>Diretor de Turma:</label>
                <Select
                  value={
                    this.state.classTeacher
                      ? this.state.classTeacher.teacherId
                      : null
                  }
                  onChange={value => this.setState({ newClassDirector: value })}
                  placeholder="Diretor de Turma..."
                >
                  {this.state.classTeacher ? (
                    <Option
                      key={this.state.classTeacher.teacherId}
                      value={this.state.classTeacher.teacherId}
                    >
                      {this.state.classTeacher.name}
                    </Option>
                  ) : null}
                  {availableTeachers}
                </Select>
              </div>
              <div
                style={{ width: "35%" }}
                className="class-edit-course-container flex-column"
              >
                <label>Curso:</label>
                <Select
                  value={this.state.selectedCourse}
                  onChange={value =>
                    this.setState({
                      selectedCourse: isString(value)
                        ? value.trim().toLowerCase()
                        : value
                    })
                  }
                  placeholder="Curso..."
                >
                  {availableCourses}
                </Select>
              </div>
              <div className="flex-row save-btn-container">
                <Button
                  onClick={this._updateClass}
                  className="save-btn"
                  type="primary"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>
          <StudentsList
            removeStudent={this._removeStudent}
            addStudent={this._addStudent}
            class={this.state.class}
            students={students}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  requestAdminClasses,
  requestCourses,
  requestAdminStudents,
  requestAdminTeachers,
  requestNewClass,
  requestDirectorTeachers,
  requestFreeTeachers,
  requestRemoveClass,
  requestStudentsPhotos,
  requestUpdateClass,
  requestAddStudentToClassByStudentId,
  requestRemoveStudentToClassByStudentId
};

const mapStateToProps = state => {
  return {
    classes: state.classes.classes,
    courses: state.classes.courses,
    students: state.students.students,
    teachers: state.teachers.teachers,
    freeTeachers: state.teachers.freeTeachers
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AdminClassManagement)
);
