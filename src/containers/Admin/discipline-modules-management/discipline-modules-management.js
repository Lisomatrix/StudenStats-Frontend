import React from "react";
import { connect } from "react-redux";
import "./../../../styles/discipline-modules-management.less";
import { Button, Table, Modal, Form, Input, message, Select } from "antd";
import { requestDisciplines } from "./../../../redux/actions/restActions/discipline";
import {
  requestModules,
  requestNewModule,
  requestUpdateModule
} from "./../../../redux/actions/restActions/module";

const Option = Select.Option;

function filterModulesByDiscipline(modules, discipline) {
  const filteredModules = [];

  for (var i = 0; i < modules.length; i++) {
    if (modules[i].disciplineId === discipline) {
      filteredModules.push(modules[i]);
    }
  }

  return filteredModules;
}

function findDisciplineNameById(disciplines, disciplineId) {
  for (var i = 0; i < disciplines.length; i++) {
    if (disciplines[i].disciplineId === disciplineId) {
      return disciplines[i].name;
    }
  }

  return "NOT FOUND";
}

function findModule(moduleId, modules) {
  for (var i = 0, n = modules.length; i < n; i++) {
    if (modules[i].moduleId === moduleId) {
      return modules[i];
    }
  }

  return {
    name: "NOT FOUND!",
    hours: 0,
    disciplineId: 1
  };
}

class DisciplineModulesManagement extends React.Component {
  state = {
    dataChanged: true,
    selectedDiscipline: -1,
    data: [],
    editModuleId: undefined,
    editName: "",
    editDisciplineId: undefined,
    editHours: 0,
    addName: "",
    addDisciplineId: undefined,
    addHours: 0
  };

  columns = [
    {
      title: "Nome",
      dataIndex: "name",
      width: "30%",
      key: "name",
      render: (text, row, index) => <a href="javascript:;">{text}</a>
    },
    {
      title: "Disciplina",
      dataIndex: "discipline",
      width: "50%",
      key: "discipline"
    },
    {
      title: "N Horas",
      dataIndex: "hours",
      width: "10%",
      key: "hours"
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

  mobileColumns = [
    {
      title: "Nome",
      dataIndex: "name",
      width: "30%",
      key: "name",
      render: (text, row, index) => <a href="javascript:;">{text}</a>
    },
    {
      title: "Disciplina",
      dataIndex: "discipline",
      width: "50%",
      key: "discipline"
    },
    // {
    //   title: "N Horas",
    //   dataIndex: "hours",
    //   width: "10%",
    //   key: "hours"
    // },
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

  componentWillMount() {
    if (!this.props.disciplines) {
      this.props
        .requestDisciplines()
        .then(result => this.setState({ dataChanged: true }));
    }

    if (!this.props.modules) {
      this.props
        .requestModules()
        .then(result => this.setState({ dataChanged: true }));
    }
  }

  componentDidMount() {
    this.forceUpdate();
  }

  componentWillUpdate(nextProps, nextState) {
    const { selectedDiscipline, dataChanged } = nextState;
    const { modules, disciplines } = nextProps;

    if (dataChanged && modules && disciplines) {
      const data = [];

      var filteredModules = [];
      var constantDiscipline;

      if (selectedDiscipline === -1) {
        filteredModules = modules;
      } else {
        constantDiscipline = findDisciplineNameById(
          disciplines,
          selectedDiscipline
        );
        filteredModules = filterModulesByDiscipline(
          modules,
          selectedDiscipline
        );
      }

      for (var i = 0, n = filteredModules.length; i < n; i++) {
        data.push({
          key: filteredModules[i].moduleId,
          name: filteredModules[i].name,
          discipline:
            selectedDiscipline === -1
              ? findDisciplineNameById(
                  disciplines,
                  filteredModules[i].disciplineId
                )
              : constantDiscipline,
          hours: filteredModules[i].hours
        });
      }

      nextState.data = data;
      nextState.dataChanged = false;
    }
  }

  _showEditModal = moduleId => {
    const foundModule = findModule(moduleId, this.props.modules);

    this.setState({
      modalVisible: true,
      isEdit: true,
      editDisciplineId: foundModule.disciplineId,
      editName: foundModule.name,
      editHours: foundModule.hours,
      editModuleId: moduleId
    });
  };

  _showCreateModal = () => {
    this.setState({ isEdit: false, modalVisible: true });
  };

  _onModalOk = () => {
    if (this.state.isEdit) {
      this.props
        .requestUpdateModule(
          {
            name: this.state.editName,
            disciplineId: this.state.editDisciplineId,
            hours: this.state.editHours
          },
          this.state.editModuleId
        )
        .then(result => {
          if (result) {
            this.setState({ modalVisible: false, dataChanged: true }, () => {
              message.success("Módulo/UFCD alterado!");
            });
          } else {
            message.error("Ocurreu um erro ao alterar o Módulo/UFCD!");
          }
        });
    } else {
      this.props
        .requestNewModule({
          name: this.state.addName,
          disciplineId: this.state.addDisciplineId,
          hours: this.state.addHours
        })
        .then(result => {
          if (result) {
            this.setState({ modalVisible: false, dataChanged: true }, () => {
              message.success("Módulo/UFCD adicionada!");
            });
          } else {
            message.error("Ocurreu um erro ao adicionar o Módulo/UFCD!");
          }
        });
    }
  };

  render() {
    const { disciplines } = this.props;

    var availableDisciplines = [];

    if (disciplines) {
      availableDisciplines = disciplines.map(discipline => (
        <Option key={discipline.disciplineId} value={discipline.disciplineId}>
          {discipline.abbreviation}
        </Option>
      ));
    }

    return (
      <div className="discipline-modules-management-container">
        <div className="ant-card-bordered discipline-modules-management animated slideInUp">
          <div className="filters-container flex-row">
            <div className="discipline-filters-container flex-row">
              <div className="discipline-filter-select-container flex-column">
                <label>Disciplina</label>
                <Select
                  onChange={value =>
                    this.setState({
                      selectedDiscipline: value,
                      dataChanged: true
                    })
                  }
                  value={this.state.selectedDiscipline}
                  style={{ minWidth: "120px" }}
                  placeholder="Disciplina..."
                >
                  {availableDisciplines}
                  <Option value={-1}>Todas</Option>
                </Select>
              </div>
            </div>
            <div className="white-space-container" />
            <div className="add-discipline-module-container">
              <Button className="add-btn" onClick={this._showCreateModal} type="primary">
                Adicionar Módulo/UFCD
              </Button>
            </div>
          </div>
          <Table
            style={{ marginTop: "18px" }}
            dataSource={this.state.data}
            columns={window.innerWidth > 600 ? this.columns : this.mobileColumns}
          />
        </div>
        <Modal
          onOk={this._onModalOk}
          onCancel={() => this.setState({ modalVisible: false })}
          okText={this.state.isEdit ? "Guardar Alterações" : "Adicionar Curso"}
          visible={this.state.modalVisible}
        >
          {this.state.isEdit ? (
            <div>
              <h2>Editar Módulo/UFCD</h2>
              <div className="module-modal-container flex-column">
                <Form.Item label="Nome">
                  <Input
                    onChange={value =>
                      this.setState({
                        editName: value.target.value
                      })
                    }
                    value={this.state.editName}
                    placeholder="Nome do Módulo/UFCD..."
                  />
                </Form.Item>
                <Form.Item label="Discipline">
                  <Select
                    className="discipline-filter-select-container"
                    style={{ width: "100%" }}
                    onChange={value =>
                      this.setState({
                        editDisciplineId: value
                      })
                    }
                    value={this.state.editDisciplineId}
                    placeholder="Disciplina..."
                  >
                    {availableDisciplines}
                  </Select>
                </Form.Item>
                <Form.Item label="N Horas">
                  <Input
                    onChange={value =>
                      this.setState({
                        editHours: value.target.value
                      })
                    }
                    value={this.state.editHours}
                    placeholder="N horas..."
                  />
                </Form.Item>
              </div>
            </div>
          ) : (
            <div>
              <h2>Adicionar Módulo/UFCD</h2>
              <div className="course-modal-container flex-column">
                <Form.Item label="Nome">
                  <Input
                    onChange={value =>
                      this.setState({
                        addName: value.target.value
                      })
                    }
                    value={this.state.addName}
                    placeholder="Nome do Módulo/UFCD..."
                  />
                </Form.Item>
                <Select
                  className="discipline-filter-select-container"
                  style={{ width: "100%" }}
                  onChange={value =>
                    this.setState({
                      addDisciplineId: value
                    })
                  }
                  value={this.state.addDisciplineId}
                  placeholder="Disciplina..."
                >
                  {availableDisciplines}
                </Select>
                <Form.Item label="N Horas">
                  <Input
                    onChange={value =>
                      this.setState({
                        addHours: value.target.value
                      })
                    }
                    value={this.state.addHours}
                    placeholder="N horas..."
                  />
                </Form.Item>
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  requestDisciplines,
  requestModules,
  requestNewModule,
  requestUpdateModule
};

const mapStateToProps = state => {
  return {
    disciplines: state.disciplines.disciplines,
    modules: state.modules.modules
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisciplineModulesManagement);
