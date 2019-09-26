import React from "react";
import { connect } from "react-redux";
import "./../../../styles/courses-management.less";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
  requestCourses,
  requestUpdateCourse,
  requestNewCourse
} from "./../../../redux/actions/restActions/class";

class CoursesManagement extends React.Component {
  state = {
    dataChanged: true,
    data: [],
    isEdit: false,
    modalVisible: false,
    addCourseName: "",
    editCourseName: "",
    editCourseId: undefined
  };

  columns = [
    {
      title: "Curso",
      dataIndex: "course",
      width: "80%",
      key: "course",
      render: (text, row, index) => <a href="javascript:;">{text}</a>
    },
    {
      title: "Editar",
      dataIndex: "action",
      width: "10%",
      key: "action",
      render: (text, row, index) => {
        return (
          <Button
            onClick={() => this._showEditModal(row.key, row.course)}
            icon="edit"
            type="dashed"
            shape="circle"
          />
        );
      }
    }
  ];

  _showEditModal = (courseId, courseName) => {
    this.setState({
      modalVisible: true,
      isEdit: true,
      editCourseId: courseId,
      editCourseName: courseName
    });
  };

  _showCreateModal = () => {
    this.setState({
      modalVisible: true,
      isEdit: false
    });
  };

  _onModalOk = () => {
    if (this.state.isEdit) {
      this.props
        .requestUpdateCourse(
          { name: this.state.editCourseName },
          this.state.editCourseId
        )
        .then(result => {
          if (result) {
            this.setState({ modalVisible: false, dataChanged: true }, () => {
              message.success("Curso alterado!");
            });
          } else {
            message.error("Ocurreu um erro ao alterar o curso!");
          }
        });
    } else {
      this.props
        .requestNewCourse({
          name: this.state.addCourseName
        })
        .then(result => {
          if (result) {
            this.setState({ modalVisible: false, dataChanged: true }, () => {
              message.success("Curso adicionado!");
            });
          } else {
            message.error("Ocurreu um erro ao adicionar o curso!");
          }
        });
    }
  };

  componentWillMount() {
    if (!this.props.courses) {
      this.props
        .requestCourses()
        .then(() => this.setState({ dataChanged: true }));
    }
  }

  componentDidMount() {
      this.forceUpdate();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.dataChanged && nextProps.courses) {
      const data = [];

      for (var i = 0; i < nextProps.courses.length; i++) {
        data.push({
          key: nextProps.courses[i].courseId,
          course: nextProps.courses[i].name
        });
      }

      nextState.data = data;
      nextState.dataChanged = false;
    }
  }

  render() {
    return (
      <div className="courses-management-container flex-column">
        <div className="ant-card-bordered animated slideInUp courses-management">
          <div className="flex-row">
            <div className="white-space-container"> </div>
            <div className="add-course-container">
              <Button onClick={this._showCreateModal} type="primary">
                Adicionar Curso
              </Button>
            </div>
          </div>
          <Table
            style={{ marginTop: "18px" }}
            dataSource={this.state.data}
            columns={this.columns}
          />
          <Modal
            onOk={this._onModalOk}
            onCancel={() => this.setState({ modalVisible: false })}
            okText={
              this.state.isEdit ? "Guardar Alterações" : "Adicionar Curso"
            }
            visible={this.state.modalVisible}
          >
            {this.state.isEdit ? (
              <div>
                <h2>Editar Curso</h2>
                <div className="course-modal-container flex-column">
                  <Form.Item label="Nome">
                    <Input
                      onChange={value =>
                        this.setState({ editCourseName: value.target.value })
                      }
                      value={this.state.editCourseName}
                      placeholder="Nome do curso..."
                    />
                  </Form.Item>
                </div>
              </div>
            ) : (
              <div>
                <h2>Adicionar Curso</h2>
                <div className="course-modal-container flex-column">
                  <Form.Item label="Nome">
                    <Input
                      onChange={value =>
                        this.setState({ addCourseName: value.target.value })
                      }
                      value={this.state.addCourseName}
                      placeholder="Nome do curso..."
                    />
                  </Form.Item>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  requestCourses,
  requestUpdateCourse,
  requestNewCourse
};

const mapStateToProps = state => {
  return {
    courses: state.classes.courses
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesManagement);
