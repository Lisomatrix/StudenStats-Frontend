import React from "react";
import { connect } from "react-redux";
import "./../../../styles/disciplines-management.less";
import { Button, Table, Modal, Form, Input, message } from "antd";
import {
  requestDisciplines,
  requestUpdateDiscipline,
  requestNewDiscipline
} from "./../../../redux/actions/restActions/discipline";

class DisciplinesManagement extends React.Component {
  state = {
    dataChanged: true,
    editMode: false,
    data: [],
    modalVisible: false,
    addDisciplineName: "",
    addAbbreviationName: "",
    editAbbreviationName: "",
    editDisciplineName: "",
    editDisciplineId: undefined
  };

  columns = [
    {
      title: "Abreviação",
      dataIndex: "abbreviation",
      width: "10%",
      key: "abbreviation",
      render: (text, row, index) => <a href="javascript:;">{text}</a>
    },
    {
      title: "Disciplina",
      dataIndex: "discipline",
      width: "70%",
      key: "discipline"
    },
    {
      title: "Editar",
      dataIndex: "action",
      width: "10%",
      key: "action",
      render: (text, row, index) => {
        return (
          <Button
            onClick={() =>
              this._showEditModal(row.key, row.discipline, row.abbreviation)
            }
            icon="edit"
            type="dashed"
            shape="circle"
          />
        );
      }
    }
  ];

  _onModalOk = () => {
    if (this.state.isEdit) {
      this.props
        .requestUpdateDiscipline(
          {
            name: this.state.editDisciplineName,
            abbreviation: this.state.editAbbreviationName
          },
          this.state.editDisciplineId
        )
        .then(result => {
          if (result) {
            this.setState({ modalVisible: false, dataChanged: true }, () => {
              message.success("Disciplina alterado!");
            });
          } else {
            message.error("Ocurreu um erro ao alterar a disciplina!");
          }
        });
    } else {
      this.props
        .requestNewDiscipline({
          name: this.state.editDisciplineName,
          abbreviation: this.state.editAbbreviationName
        })
        .then(result => {
          if (result) {
            this.setState({ modalVisible: false, dataChanged: true }, () => {
              message.success("Disciplina adicionada!");
            });
          } else {
            message.error("Ocurreu um erro ao adicionar a disciplina!");
          }
        });
    }
  };

  _showEditModal = (disciplineId, disciplineName, disciplineAbbreviation) => {
    this.setState({
      modalVisible: true,
      isEdit: true,
      editDisciplineId: disciplineId,
      editDisciplineName: disciplineName,
      editAbbreviationName: disciplineAbbreviation
    });
  };

  _showCreateModal = () => {
    this.setState({ isEdit: false, modalVisible: true });
  };

  componentWillMount() {
    if (!this.props.disciplines) {
      this.props
        .requestDisciplines()
        .then(() => this.setState({ dataChanged: true }));
    }
  }

  componentDidMount() {
    this.forceUpdate();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.dataChanged && nextProps.disciplines) {
      const data = [];

      for (var i = 0; i < nextProps.disciplines.length; i++) {
        data.push({
          key: nextProps.disciplines[i].disciplineId,
          discipline: nextProps.disciplines[i].name,
          abbreviation: nextProps.disciplines[i].abbreviation
        });
      }

      nextState.data = data;
      nextState.dataChanged = false;
    }
  }

  render() {
    return (
      <div className="discipline-management-container">
        <div className="ant-card-bordered animated slideInUp discipline-management flex-column">
          <div className="flex-row">
            <div className="white-space-container" />
            <div className="add-discipline-container">
              <Button onClick={this._showCreateModal} type="primary">
                Adicionar Disciplina
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
              this.state.isEdit ? "Guardar Alterações" : "Adicionar Disciplina"
            }
            visible={this.state.modalVisible}
          >
            {this.state.isEdit ? (
              <div>
                <h2>Editar Disciplina</h2>
                <div className="course-modal-container flex-column">
                  <Form.Item label="Nome">
                    <Input
                      onChange={value =>
                        this.setState({
                          editDisciplineName: value.target.value
                        })
                      }
                      value={this.state.editDisciplineName}
                      placeholder="Nome da disciplina..."
                    />
                  </Form.Item>
                  <Form.Item label="Abreviação">
                    <Input
                      onChange={value =>
                        this.setState({
                          editAbbreviationName: value.target.value
                        })
                      }
                      value={this.state.editAbbreviationName}
                      placeholder="Abreviação da disciplina..."
                    />
                  </Form.Item>
                </div>
              </div>
            ) : (
              <div>
                <h2>Adicionar Disciplina</h2>
                <div className="course-modal-container flex-column">
                  <Form.Item label="Nome">
                    <Input
                      onChange={value =>
                        this.setState({
                          addAbbreviationName: value.target.value
                        })
                      }
                      value={this.state.addAbbreviationName}
                      placeholder="Nome da disciplina..."
                    />
                  </Form.Item>
                  <Form.Item label="Abreviação">
                    <Input
                      onChange={value =>
                        this.setState({
                          editDisciplineName: value.target.value
                        })
                      }
                      value={this.state.editDisciplineName}
                      placeholder="Abreviação da disciplina..."
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
  requestDisciplines,
  requestUpdateDiscipline,
  requestNewDiscipline
};

const mapStateToProps = state => {
  return {
    disciplines: state.disciplines.disciplines
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisciplinesManagement);
