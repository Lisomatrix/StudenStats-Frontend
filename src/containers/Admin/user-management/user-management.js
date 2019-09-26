import React from "react";
import { connect } from "react-redux";
import "./../../../styles/users-management.less";
import {
  Button,
  Modal,
  Tabs,
  Input,
  Select,
  DatePicker,
  message,
  Form
} from "antd";
import {
  requestUserRoles,
  requestNewStudent,
  requestNewAdmin,
  requestNewParent,
  requestNewTeacher,
  requestAccounts,
  requestDeleteUser
} from "./../../../redux/actions/restActions/user";
import UsersTable from "./../../../components/users-management-components/users-table";
import moment from "moment";
import CountUp from "react-countup";
import withRouter from "react-router-dom/withRouter";

const TabPane = Tabs.TabPane;

const Option = Select.Option;

var roleOptions = [];

function getDateStringFromMoment(date) {
  var selectedDay = date.date();

  if (selectedDay < 10) selectedDay = "0" + selectedDay;

  var selectedMonth = date.month() + 1;

  if (selectedMonth < 10) selectedMonth = "0" + selectedMonth;

  const selectedYear = date.year();

  const dateString = selectedYear + "-" + selectedMonth + "-" + selectedDay;

  return dateString;
}

const NewUserForm = Form.create({ name: "new_user_form" })(
  class extends React.Component {
    state = {
      newUserModalVisible: false,
      newUserName: "",
      newUserAddress: "",
      newUserBirthdayDate: moment(new Date()),
      newUserBirthdayDateString: "",
      newUserRole: null,
      newUserPhoneNumber: "",
      addNewUserLoading: false,
      selectedTabKey: "1"
    };

    render() {
      const { visible, close, add, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title="Novo Utilizador"
          onCancel={close}
          onOk={add}
          okText="Adicionar"
          okButtonProps={{ loading: this.props.loading }}
        >
          <Form layout="vertical">
            <Form.Item label="Nome">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Introduza um nome!"
                  }
                ]
              })(<Input placeholder="Tiago..." />)}
            </Form.Item>
            <Form.Item label="Morada">
              {getFieldDecorator("address", {
                rules: [
                  {
                    required: true,
                    message: "Introduza uma morada"
                  }
                ]
              })(<Input placeholder="Rua exemplo..." />)}
            </Form.Item>

            <div className="new-user-role-and-birthday-container flex-row">
              <Form.Item
                className="new-user-birthday-container"
                label="Data de Nascimento:"
              >
                {getFieldDecorator("birthDate", {
                  rules: [
                    {
                      required: true,
                      message: "Please input the title of collection!"
                    }
                  ]
                })(<DatePicker placeholder="00/00/0000" format="DD/MM/YYYY" />)}
              </Form.Item>
              <Form.Item className="new-user-role-container" label="Cargo:">
                {getFieldDecorator("role", {
                  rules: [
                    {
                      required: true,
                      message: "Escolha um cargo!"
                    }
                  ]
                })(<Select placeholder="Aluno...">{roleOptions}</Select>)}
              </Form.Item>
            </div>
            <Form.Item
              className="new-user-phone-container"
              label="Número de telemóvel"
            >
              {getFieldDecorator("phoneNumber", {
                rules: [
                  {
                    required: false,
                    message: "Introduza um número de telemóvel",
                    max: 9,
                    min: 9
                  }
                ]
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

class UserManagement extends React.Component {
  state = {
    newUserModalVisible: false,
    newUserName: "",
    newUserAddress: "",
    newUserBirthdayDate: moment(new Date()),
    newUserBirthdayDateString: "",
    newUserRole: null,
    newUserPhoneNumber: "",
    addNewUserLoading: false,
    selectedTabKey: "1",
    tabChanged: true,
    data: []
  };

  _getRole = roleId => {
    if (this.props.roles) {
      for (var i = 0; i < this.props.roles.length; i++) {
        if (this.props.roles[i].id === roleId) {
          return this.props.roles[i];
        }
      }
    }

    return null;
  };

  _saveFormRef = formRef => {
    this.formRef = formRef;
  };

  _addUser = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      form.resetFields();

      this.setState({ addNewUserLoading: true });

      const dateString = getDateStringFromMoment(values.birthDate);
      const selectedRole = this._getRole(values.role);

      const newUser = {
        name: values.name,
        address: values.address,
        birthDate: dateString,
        phoneNumber: values.phoneNumber,
        roleId: selectedRole.id
      };

      var promise;

      if (selectedRole.role === "ROLE_ALUNO") {
        promise = this.props.requestNewStudent(newUser);
      } else if (selectedRole.role === "ROLE_PROFESSOR") {
        promise = this.props.requestNewTeacher(newUser);
      } else if (selectedRole.role === "ROLE_ADMIN") {
        promise = this.props.requestNewAdmin(newUser);
      } else if (selectedRole.role === "ROLE_PARENT") {
        promise = this.props.requestNewParent(newUser);
      }

      if (promise) {
        promise.then(result => {
          this.setState({
            addNewUserLoading: false,
            newUserModalVisible: false
          });

          if (result) {
            message.success("Utilizador adicionado com sucesso!");

            this.setState({
              newUserName: "",
              newUserAddress: "",
              newUserBirthdayDate: moment(new Date()),
              newUserBirthdayDateString: "",
              newUserRole: null,
              newUserPhoneNumber: "",
              tabChanged: true
            });
          } else {
            message.error("Ocurreu um erro ao adicionar o utilizador");
          }
        });
      } else {
        this.setState({ addNewUserLoading: false });
      }
    });
  };

  _generateRow = account => {
    const row = {
      name: account.name,
      email: account.email ? account.email : "",
      registerCode: account.registrationCode,
      created: account.created,
      key: account.userId
    };

    return row;
  };

  _generateRows = accounts => {
    const rows = [];

    for (var i = 0; i < accounts.length; i++) {
      rows.push(this._generateRow(accounts[i]));
    }

    return rows;
  };

  _editUser = userId => {
    this.props.history.push("/user/" + userId);
  };

  _removeUser = userId => { 

    Modal.confirm({
      title: 'Eliminar utilizador?',
      content: 'Tem a certeza que pretendo eliminar este utilizador?',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => this.props.requestDeleteUser(userId).then((result) => {
        if(result) {
          message.success('Utilizador Eliminado!');
          this.setState({ tabChanged: true });
        } else {
          message.error('Ocurreu um erro ao eliminar o utilizador!')
        }
      }),
    });
  };

  componentWillMount() {
    if (!this.props.roles) {
      this.props.requestUserRoles().then(roles => {
        if (roles) {
          roleOptions = roles.map(role => {
            var roleName = "";

            if (role.role === "ROLE_ALUNO") {
              roleName = "Aluno";
            } else if (role.role === "ROLE_PROFESSOR") {
              roleName = "Professor";
            } else if (role.role === "ROLE_PARENT") {
              roleName = "Encarregados de Educação";
            } else if (role.role === "ROLE_ADMIN") {
              roleName = "Admistrador";
            }

            return (
              <Option key={role.id} value={role.id}>
                {roleName}
              </Option>
            );
          });
        }
      });
    }

    if (!this.props.accounts) {
      this.props.requestAccounts();
    }
  }

  componentDidMount() {
    this.forceUpdate();
  }

  componentWillUpdate(nextProps, nextState) {

    var differentAccountSize = false;

    if (nextProps.accounts && nextState.tabChanged || differentAccountSize) {
      var data = [];

      if (nextState.selectedTabKey === "1") {
        data = this._generateRows(nextProps.accounts.teachers);
      } else if (nextState.selectedTabKey === "2") {
        data = this._generateRows(nextProps.accounts.students);
      } else if (nextState.selectedTabKey === "3") {
        data = this._generateRows(nextProps.accounts.parents);
      } else if (nextState.selectedTabKey === "4") {
        data = this._generateRows(nextProps.accounts.admins);
      }


      nextState.data = data;
      nextState.tabChanged = false;
    }
  }

  render() {
    var name = "";

    if (this.state.selectedTabKey === "1") {
      name = "Professores:";
    } else if (this.state.selectedTabKey === "2") {
      name = "Alunos:";
    } else if (this.state.selectedTabKey === "3") {
      name = "Encarregados de Educação:";
    } else if (this.state.selectedTabKey === "4") {
      name = "Adminstrador:";
    }

    return (
      <div className="user-management-container">
        <div className="ant-card-bordered user-management animated slideInUp">
          <div className="user-management-options-container">
            <div style={{ marginLeft: "8px" }} className="flex-row">
              <h2>
                {name}
                <CountUp
                  style={{ marginLeft: "4px" }}
                  end={this.state.data.length}
                  duration={1}
                />
              </h2>
            </div>
            <div style={{ width: "90%" }} />
            <div className="add-user-btn">
              <Button
                className="add-user-btn"
                onClick={() => this.setState({ newUserModalVisible: true })}
                type="primary"
              >
                Adicionar utilizador
              </Button>
            </div>
          </div>
          <div className="user-management-content-container">
            <Tabs
              activeKey={this.state.selectedTabKey}
              onChange={value =>
                this.setState({ selectedTabKey: value, tabChanged: true })
              }
            >
              <TabPane tab="Professores" key="1">
                {this.state.selectedTabKey === "1" ? (
                  <UsersTable edit={this._editUser}
                    remove={this._removeUser} data={this.state.data} />
                ) : null}
              </TabPane>
              <TabPane tab="Alunos" key="2">
                {this.state.selectedTabKey === "2" ? (
                  <UsersTable edit={this._editUser}
                    remove={this._removeUser} data={this.state.data} />
                ) : null}
              </TabPane>
              <TabPane tab="Encarregados de Educação" key="3">
                {this.state.selectedTabKey === "3" ? (
                  <UsersTable edit={this._editUser}
                    remove={this._removeUser} data={this.state.data} />
                ) : null}
              </TabPane>
              <TabPane tab="Admistrador" key="4">
                {this.state.selectedTabKey === "4" ? (
                  <UsersTable edit={this._editUser}
                    remove={this._removeUser} data={this.state.data} />
                ) : null}
              </TabPane>
            </Tabs>
          </div>
        </div>
        <NewUserForm
          wrappedComponentRef={this._saveFormRef}
          visible={this.state.newUserModalVisible}
          close={() => this.setState({ newUserModalVisible: false })}
          add={this._addUser}
          loading={this.state.addNewUserLoading}
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  requestUserRoles,
  requestNewStudent,
  requestNewAdmin,
  requestNewParent,
  requestNewTeacher,
  requestAccounts,
  requestDeleteUser
};

const mapStateToProps = state => {
  return {
    roles: state.authentication.roles,
    accounts: state.admin.accounts
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagement));
