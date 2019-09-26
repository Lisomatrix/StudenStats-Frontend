import React from "react";
import { connect } from "react-redux";
import "./../../../styles/classes-management.less";
import {
  Select,
  Table,
  Button,
  Modal,
  message,
  Input,
  Dropdown,
  Icon,
  Menu
} from "antd";
import {
  requestAdminClasses,
  requestCourses,
  requestNewClass,
  requestRemoveClass
} from "./../../../redux/actions/restActions/class";
import { requestAdminStudents } from "./../../../redux/actions/restActions/student";
import {
  requestAdminTeachers,
  requestDirectorTeachers,
  requestFreeTeachers
} from "./../../../redux/actions/restActions/teacher";
import { isString } from "util";
import withRouter from "react-router-dom/withRouter";

const Option = Select.Option;

const years = [1, 2, 3];

var yearsOptions = [];

class ClassesManagement extends React.Component {
  state = {
    selectedYear: -1,
    selectedCourse: -1,
    data: [],
    filtersChanged: true,
    newClassModalVisible: false,
    newClassYear: 1,
    newClassCourse: null,
    newClassDirector: null,
    addClassLoading: false,
    newClassName: ""
  };

  componentWillMount() {
    if (yearsOptions.length === 0) {
      yearsOptions = years.map(year => {
        return (
          <Option key={year} value={year}>
            {year}
          </Option>
        );
      });
    }

    if (!this.props.classes) {
      this.props
        .requestAdminClasses()
        .then(() => this.setState({ filtersChanged: true }));
    }

    if (!this.props.courses) {
      this.props
        .requestCourses()
        .then(() => this.setState({ filtersChanged: true }));
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

  columns = [
    {
      title: "Ano",
      dataIndex: "year",
      key: "year"
    },
    {
      title: "Curso",
      dataIndex: "course",
      key: "course"
    },
    {
      title: "N Alunos",
      dataIndex: "studentNumber",
      key: "studentNumber"
    },
    {
      title: "Diretor de Turma",
      dataIndex: "classDirector",
      key: "classDirector"
    },
    {
      dataIndex: "actions",
      key: "actions",
      render: (text, row, key) => {
        const menu = (
          <Menu style={{ width: "140px" }}>
            <Menu.Item
              onClick={() => this.props.history.push("/class/" + row.key)}
              className="context-menu-item small-menu-item"
              key="1"
            >
              {" "}
              <Icon style={{ fontSize: "20px" }} type="edit" /> Editar
            </Menu.Item>
            <Menu.Item
              onClick={() => this._removeClass(row.key)}
              className="context-menu-item small-menu-item"
              key="3"
            >
              {" "}
              <Icon style={{ fontSize: "20px" }} type="delete" /> Eliminar
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <a href="javascript:;" className="ant-dropdown-link">
              Opções <Icon type="down" />
            </a>
          </Dropdown>
        );
      }
    }
  ];

  mobileColumns = [
    // {
    //   title: "Ano",
    //   dataIndex: "year",
    //   key: "year"
    // },
    // {
    //   title: "Curso",
    //   dataIndex: "course",
    //   key: "course"
    // },
    // {
    //   title: "N Alunos",
    //   dataIndex: "studentNumber",
    //   key: "studentNumber"
    // },
    {
      title: "Diretor de Turma",
      dataIndex: "classDirector",
      key: "classDirector",
      width: '65%'
    },
    {
      dataIndex: "actions",
      key: "actions",
      render: (text, row, key) => {
        const menu = (
          <Menu style={{ width: "140px" }}>
            <Menu.Item
              onClick={() => this.props.history.push("/class/" + row.key)}
              className="context-menu-item small-menu-item"
              key="1"
            >
              {" "}
              <Icon style={{ fontSize: "20px" }} type="edit" /> Editar
            </Menu.Item>
            <Menu.Item
              onClick={() => this._removeClass(row.key)}
              className="context-menu-item small-menu-item"
              key="3"
            >
              {" "}
              <Icon style={{ fontSize: "20px" }} type="delete" /> Eliminar
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <a href="javascript:;" className="ant-dropdown-link">
              Opções <Icon type="down" />
            </a>
          </Dropdown>
        );
      }
    }
  ];

  componentDidMount() {
    this.forceUpdate();
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      (nextState.filtersChanged && nextProps.classes) ||
      (nextProps.classes && nextState.data.length === 0)
    ) {
      nextState.data = this._generateRows(
        nextProps.classes,
        nextState.selectedCourse,
        nextState.selectedYear,
        nextProps.courses
      );
      nextState.filtersChanged = false;
    }
  }

  _generateRows = (classes, selectedCourse, selectedYear, courses) => {
    const rows = [];

    var selectedCourseName;

    if (courses) {
      for (var i = 0; i < courses.length; i++) {
        if (courses[i].courseId === selectedCourse) {
          selectedCourseName = courses[i].name;
          break;
        }
      }
    }

    for (var i = 0; i < classes.length; i++) {
      if (
        (classes[i].year === selectedYear &&
          classes[i].course.trim().toLowerCase() === selectedCourseName) ||
        (selectedYear === -1 && selectedCourse === -1) ||
        (selectedYear === -1 && classes[i].course === selectedCourseName) ||
        (classes[i].year === selectedYear && selectedCourse === -1)
      ) {
        rows.push({
          key: classes[i].classId,
          year: classes[i].year,
          course: classes[i].course,
          studentNumber: classes[i].students.length,
          classDirector: classes[i].classDirectorName
        });
      }
    }

    return rows;
  };

  _getCourseIdByName = name => {
    if (this.props.courses) {
      for (var i = 0; i < this.props.courses.length; i++) {
        if (
          this.props.courses[i].name.trim().toLowerCase() ===
          name.trim().toLowerCase()
        ) {
          return this.props.courses[i].courseId;
        }
      }
    }

    return "";
  };

  _addClass = () => {
    if (
      !this.state.newClassCourse ||
      !this.state.newClassDirector ||
      !this.state.newClassYear
    ) {
      if (!this.state.newClassCourse) {
        message.error("Selecione um curso!");
      } else if (!this.state.newClassDirector) {
        message.error("Selecione um diretor de turma!");
      } else if (!this.error.newClassYear) {
        message.error("Selecione um ano!");
      }

      return;
    }

    this.setState({ addClassLoading: true }, () => {
      this.props
        .requestNewClass({
          name: this.state.newClassName,
          courseId: this.state.selectedCourse, //this._getCourseIdByName(this.state.newClassCourse),
          year: this.state.newClassYear,
          teacherId: this.state.newClassDirector
        })
        .then(success => {
          if (success) {
            message.success("Turma adicionada!");
            this.setState({
              filtersChanged: true,
              addClassLoading: false,
              newClassModalVisible: false
            });
          } else {
            message.error("Ocurreu um erro ao adicionar a turma");
            this.setState({ newClassModalVisible: false });
          }
        });
    });
  };

  _removeClass = classId => {
    Modal.confirm({
      title: "Eliminar Turma",
      content: "Tem a certeza que pretende eliminar esta turma?",
      okText: "Sim",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: () => {
        this.props.requestRemoveClass(classId).then(x => {
          if (x) {
            message.success("Turma eliminada com sucesso!");
            this.setState({ filtersChanged: true });
          } else {
            message.error("Ocorreu um erro ao tentar elimar a turma!");
          }
        });
      }
    });
  };

  render() {
    var avaibleCourses;
    var avaibleTeachers;

    if (this.props.courses) {
      avaibleCourses = this.props.courses.map(item => {
        return (
          <Option key={item.courseId} value={item.courseId}>
            {item.name}
          </Option>
        );
      });
    }

    if (this.props.freeTeachers) {
      avaibleTeachers = this.props.freeTeachers.map(item => {
        return (
          <Option key={item.teacherId} value={item.teacherId}>
            {item.name}
          </Option>
        );
      });
    }

    return (
      <div className="classes-management-container">
        <div className="ant-card-bordered classes-management animated slideInUp flex-column">
          <div className="classes-management-select-container flex-row">
            <div className="flex-column select">
              <label>Ano:</label>
              <Select
                value={this.state.selectedYear}
                onChange={value =>
                  this.setState({ selectedYear: value, filtersChanged: true })
                }
                placeholder="Ano..."
              >
                {yearsOptions}
                <Option value={-1}>Todos</Option>
              </Select>
            </div>
            <div className="flex-column select">
              <label>Curso:</label>
              <Select
                value={this.state.selectedCourse}
                onChange={value =>
                  this.setState({
                    selectedCourse: isString(value)
                      ? value.trim().toLowerCase()
                      : value,
                    filtersChanged: true
                  })
                }
                placeholder="Curso..."
              >
                {avaibleCourses}
                <Option value={-1}>Todos</Option>
              </Select>
            </div>
            <div style={{ width: "100%" }} />

            <Button
              onClick={() => this.setState({ newClassModalVisible: true })}
              className="add-class-btn"
              type="primary"
            >
              Adicionar Turma
            </Button>
          </div>
          <div className="classes-management-table-container">
            <Table
              style={{
                marginLeft: (window.innerWidth > 600 ? '5px' : '0'),
                marginRight: (window.innerWidth > 600 ? '5px' : '0'),
              }}
              columns={window.innerWidth > 600 ? this.columns : this.mobileColumns}
              dataSource={this.state.data}
            />
          </div>
        </div>
        <Modal
          visible={this.state.newClassModalVisible}
          onCancel={() => this.setState({ newClassModalVisible: false })}
          onOk={this._addClass}
          okText="Adicionar Turma"
          okButtonProps={{ loading: this.state.addClassLoading }}
        >
          <div className="new-class-modal-container flex-column">
            <div className="new-class-modal-selects-container flex-row">
              <div style={{ width: "30%" }} className="flex-column select">
                <label>Ano:</label>
                <Select
                  onChange={value => this.setState({ newClassYear: value })}
                  placeholder="Ano..."
                >
                  {yearsOptions}
                </Select>
              </div>

              <div style={{ width: "70%" }} className="flex-column select">
                <label>Diretor de Turma:</label>
                <Select
                  onChange={value => this.setState({ newClassDirector: value })}
                  placeholder="Diretor de Turma..."
                >
                  {avaibleTeachers}
                </Select>
              </div>
            </div>

            <div className="new-class-modal-selects-container flex-row">
              <div
                style={{ width: "70%", marginTop: "18px" }}
                className="flex-column select"
              >
                <label>Curso:</label>
                <Select
                  onChange={value =>
                    this.setState({
                      newClassCourse: value.trim().toLowerCase()
                    })
                  }
                  placeholder="Curso..."
                >
                  {avaibleCourses}
                </Select>
              </div>
              <div
                style={{ width: "70%", marginTop: "18px" }}
                className="flex-column select"
              >
                <label>Nome da Turma:</label>
                <Input
                  value={this.state.newClassName}
                  onChange={value =>
                    this.setState({ newClassName: value.target.value })
                  }
                  placeholder="Nome da Turma..."
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    classes: state.classes.classes,
    courses: state.classes.courses,
    students: state.students.students,
    teachers: state.teachers.teachers,
    freeTeachers: state.teachers.freeTeachers
  };
};

const mapDispatchToProps = {
  requestAdminClasses,
  requestCourses,
  requestAdminStudents,
  requestAdminTeachers,
  requestNewClass,
  requestDirectorTeachers,
  requestFreeTeachers,
  requestRemoveClass
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ClassesManagement)
);
