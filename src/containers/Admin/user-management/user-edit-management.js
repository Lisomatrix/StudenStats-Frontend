import React from "react";
import { Input, Form, message, Button, Upload, Icon, AutoComplete } from "antd";
import {
  requestUserRoles,
  requestNewStudent,
  requestNewAdmin,
  requestNewParent,
  requestNewTeacher,
  requestAccounts,
  requestAccount,
  requestUpdateStudent,
  requestUpdateTeacher,
  requestUpdateAdmin,
  requestUpdateParent,
  requestUserEditPhoto
} from "./../../../redux/actions/restActions/user";
import { requestStudentsWithoutParent } from "./../../../redux/actions/restActions/student";
import {
  requestAdminClasses,
  requestAddStudentToClass
} from "./../../../redux/actions/restActions/class";
import {
  requestUserEditStudentParent,
  requestAdminParentChildren,
  requestAddParentChild,
  requestRemoveParentChild,
  requestUserEditStudent,
  requestAdminTeacherDisciplines
} from "./../../../redux/actions/restActions/userEdit";
import { requestDisciplines, requestNewDisciplineTeacher, requestRemoveDisciplineTeacher } from "./../../../redux/actions/restActions/discipline";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./../../../styles/user-management.less";
import Loading from "./../../Neutral/loading/loading";
import ParentEdit from "./../../../components/users-management-components/parent-edit";
import StudentEdit from "./../../../components/users-management-components/student-edit";
import TeacherEdit from "./../../../components/users-management-components/teacher-edit";
import { config } from "./../../../constants/config";
import { isString } from "util";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";

  if (!isJPG && !isPNG) {
    message.error("Só é permitido imagens PNG ou JPG!");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isLt2M) {
    message.error("A imagem não pode ter mais de 2MB!");
  }

  if ((isJPG && isLt2M) || (isPNG && isLt2M)) {
    return true;
  } else {
    return false;
  }
}

const UserForm = Form.create({ name: "user_form" })(
  class extends React.Component {
    state = {
      disabled: false,
      loading: false
    };

    handleChange = info => {
      if (info.file.status === "uploading") {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === "done") {
        getBase64(info.file.originFileObj, imageUrl => {
          this.props.handleUploadChange(info);
          this.setState({
            imageUrl,
            loading: false
          });
        });
      }
    };

    render() {
      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? "loading" : "plus"} />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

      const {
        name,
        email,
        phoneNumber,
        address,
        form,
        disabled,
        imgUrl,
        userId
      } = this.props;
      const { getFieldDecorator } = form;

      const action = config.httpServerURL + "/user/" + userId + "/photo";

      return (
        <Form hideRequiredMark={disabled} layout="vertical">
          <div className="photo-name-email-container flex-row">
            <div className="user-photo-container">
              <label className="ant-form-item-label label user-photo-upload-title">
                Foto de Perfil
              </label>
              <Upload
                name="avatar"
                listType="picture-card"
                className="user-photo-upload"
                showUploadList={false}
                name="file"
                action={action}
                headers={{ Authorization: localStorage.getItem("token") }}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                {imgUrl ? <img src={imgUrl} alt="avatar" /> : uploadButton}
              </Upload>
            </div>
            <div className="email-and-role-container flex-column">
              <Form.Item className="name-input-container" label="Nome">
                {getFieldDecorator("name", {
                  initialValue: name,
                  rules: [
                    {
                      required: true,
                      message: "Introduza um nome!"
                    }
                  ]
                })(<Input disabled={this.state.disabled} />)}
              </Form.Item>
              <Form.Item className="email-container" label="Email">
                {getFieldDecorator("email", {
                  initialValue: email,
                  rules: [
                    {
                      required: true,
                      message: "Introduza um email!"
                    }
                  ]
                })(<Input disabled={this.state.disabled} />)}
              </Form.Item>
            </div>
          </div>

          <div className="phone-address-container flex-row">
            <Form.Item className="phone-container" label="Número de telemóvel">
              {getFieldDecorator("phoneNumber", {
                initialValue: phoneNumber,
                rules: [
                  {
                    required: false,
                    message: "Introduza um número de telemóvel!"
                  }
                ]
              })(<Input disabled={this.state.disabled} />)}
            </Form.Item>
            <Form.Item className="address-container" label="Morada">
              {getFieldDecorator("address", {
                initialValue: address,
                rules: [
                  {
                    required: true,
                    message: "Introduza uma morada"
                  }
                ]
              })(
                <Input
                  disabled={this.state.disabled}
                  placeholder="Rua exemplo..."
                />
              )}
            </Form.Item>
          </div>
        </Form>
      );
    }
  }
);

class UserEditManagement extends React.Component {
  state = {
    userAccount: null,
    userId: this.props.match.params.id,
    disabled: true,
    loading: false,
    imageUrl: null,
    parentStudents: []
  };

  componentDidUpdate(nextProps, nextState) {
    if (nextState.userAccount) {
      if (nextState.userAccount.role === "ROLE_PARENT") {
        if (!nextProps.parentStudents) {
          nextProps.requestAdminParentChildren(nextState.userAccount.userId);
        }

        if (!nextProps.StudentsWithoutParent) {
          nextProps.requestStudentsWithoutParent();
        }
      } else if (nextState.userAccount.role === "ROLE_ALUNO") {
        if (!nextProps.classes) {
          nextProps.requestAdminClasses();
        }

        if (!nextProps.student) {
          nextProps.requestUserEditStudent(nextState.userId).then(result => {
            if (result) {
              nextProps.requestUserEditStudentParent(result.studentId);
            } else {
            }
          });
        }
      } else if (nextState.userAccount.role === "ROLE_PROFESSOR") {
        if (!nextProps.teacherDisciplines) {
          nextProps.requestAdminTeacherDisciplines(nextState.userAccount.userId);
        }
      }
    }
  }

  componentWillMount() {
    this.props.requestAccount(this.state.userId).then(result => {
      if (result) {
        this.setState({ userAccount: result });
      } else {
        message.error("Ocurreu um erro ao buscar o utilizador!");
      }
    });

    this.props
      .requestUserEditPhoto(this.state.userId)
      .then(result => this.setState({ imageUrl: result }));

    if (!this.props.accounts) {
      this.props.requestAccounts();
    }

    if (!this.props.disciplines) {
      this.props.requestDisciplines();
    }
  }

  componentWillUnmount() {
    if (this.state.imageUrl) {
      window.URL.revokeObjectURL(this.state.imageUrl);
    }
  }

  handleChange = info => {
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
    }
  };

  _saveFormRef = formRef => {
    this.formRef = formRef;
  };

  _saveEdits = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const updateUser = {
        name: values.name,
        address: values.address,
        phoneNumber: values.phoneNumber ? values.phoneNumber : "",
        roleId: this.state.userAccount.roleId,
        email: values.email
      };

      if (this.state.userAccount.role === "ROLE_ALUNO") {
        this.props.requestUpdateStudent(updateUser, this.state.userId);
      } else if (this.state.userAccount.role === "ROLE_PARENT") {
        this.props.requestUpdateParent(updateUser, this.state.userId);
      } else if (this.state.userAccount.role === "ROLE_ADMIN") {
        this.props.requestUpdateAdmin(updateUser, this.state.userId);
      } else if (this.state.userAccount.role === "ROLE_PROFESSOR") {
        this.props.requestUpdateTeacher(updateUser, this.state.userId);
      }
    });
  };

  _addChild = studentUserId => {
    const hide = message.loading("A processar pedido..", 0);

    this.props
      .requestAddParentChild(this.state.userId, studentUserId)
      .then(result => {
        hide();
        if (!isString(result)) {
          message.success("Educando associado com sucesso!");
        } else {
          message.error(result);
        }
      });
  };

  _changeParent = (studentUserId, parentUserId) => {
    const hide = message.loading("A processar pedido..", 0);

    this.props
      .requestAddParentChild(parentUserId, studentUserId)
      .then(result => {
        hide();
        if (!isString(result)) {
          message.success("Encarregado associado com sucesso!");
        } else {
          message.error(result);
        }
      });
  };

  _removeChild = student => {
    const hide = message.loading("A processar pedido..", 0);

    this.props
      .requestRemoveParentChild(this.state.userId, student)
      .then(result => {
        hide();
        if (!isString(result)) {
          message.success("Educando desassociado com sucesso!");
        } else {
          message.error("Ocurreu um erro ao desassociar o educando!");
        }
      });
  };

  _addClassToUser = classId => {
    this.props
      .requestAddStudentToClass(classId, this.state.userId)
      .then(result => {
        if (result) {
          message.success("Turma mudade com sucesso!");
        } else {
          message.error("Ocurreu um erro ao mudar a turma!");
        }
      });
  };

  render() {
    var children = [];
    var parents = [];
    var classes = [];

    if (
      this.props.StudentsWithoutParent &&
      this.state.userAccount &&
      this.state.userAccount.role === "ROLE_PARENT"
    ) {
      children = this.props.StudentsWithoutParent.map(student => (
        <AutoComplete.Option key={student.studentId} value={student.name}>
          {student.name}
        </AutoComplete.Option>
      ));
    }

    if (
      this.props.accounts &&
      this.state.userAccount &&
      this.state.userAccount.role === "ROLE_ALUNO"
    ) {
      parents = this.props.accounts.parents.map(parent => (
        <AutoComplete.Option key={parent.userId} value={parent.name}>
          {parent.name}
        </AutoComplete.Option>
      ));
    }

    if (
      this.props.classes &&
      this.state.userAccount &&
      this.state.userAccount.role === "ROLE_ALUNO"
    ) {
      classes = this.props.classes.map(classs => (
        <AutoComplete.Option key={classs.classId} value={classs.name}>
          {classs.name}
        </AutoComplete.Option>
      ));
    }

    return (
      <div className="user-edit-management-container">
        {this.props.accounts && this.state.userAccount ? (
          <div className="ant-card-bordered user-edit-management animated slideInUp flex-column">
            <UserForm
              imgUrl={this.state.imageUrl}
              handleUploadChange={this.handleChange}
              wrappedComponentRef={this._saveFormRef}
              name={this.state.userAccount.name}
              email={this.state.userAccount.email}
              role={this.state.userAccount.roleId}
              phoneNumber={this.state.userAccount.phoneNumber}
              address={this.state.userAccount.address}
              disabled={this.state.disabled}
              changeDisabled={value => this.setState({ disabled: !value })}
              userId={this.state.userId}
            />
            {this.state.userAccount &&
            this.state.userAccount.role === "ROLE_PARENT" ? (
              <ParentEdit
                parentStudents={this.props.parentStudents}
                addChild={this._addChild}
                removeChild={this._removeChild}
                students={children}
              />
            ) : (
              ""
            )}
            {this.state.userAccount &&
            this.state.userAccount.role === "ROLE_PROFESSOR" ? (
              <TeacherEdit
                disciplines={this.props.disciplines}
                teacherDisciplines={this.props.teacherDisciplines}
                userId={this.state.userId}
                newDiscipline={this.props.requestNewDisciplineTeacher}
                removeDiscipline={this.props.requestRemoveDisciplineTeacher}
              />
            ) : (
              ""
            )}
            {this.state.userAccount &&
            this.state.userAccount.role === "ROLE_ALUNO" ? (
              <StudentEdit
                parents={parents}
                classes={classes}
                addClass={this._addClassToUser}
                student={this.props.student}
                studentParent={this.props.studentParent}
                changeParent={this._changeParent}
                userId={this.state.userId}
              />
            ) : (
              ""
            )}
            <div className="flex-row">
              <div style={{ width: "90%" }} />
              <Button
                style={{ marginRight: "8px" }}
                onClick={() => this.props.history.push("/users")}
                type="default"
              >
                Cancelar
              </Button>
              <Button onClick={this._saveEdits} type="primary">
                Guardar Alterações
              </Button>
            </div>
          </div>
        ) : (
          <Loading />
        )}
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
  requestAccount,
  requestUpdateStudent,
  requestUpdateTeacher,
  requestUpdateAdmin,
  requestUpdateParent,
  requestStudentsWithoutParent,
  requestUserEditPhoto,
  requestAddParentChild,
  requestAdminParentChildren,
  requestRemoveParentChild,
  requestAdminClasses,
  requestAddStudentToClass,
  requestUserEditStudent,
  requestUserEditStudentParent,
  requestDisciplines,
  requestAdminTeacherDisciplines,
  requestNewDisciplineTeacher, 
  requestRemoveDisciplineTeacher
};

const mapStateToProps = state => {
  return {
    accounts: state.admin.accounts,
    StudentsWithoutParent: state.students.StudentsWithoutParent,
    parentStudents: state.userEdit.parentStudents,
    classes: state.classes.classes,
    student: state.userEdit.student,
    studentParent: state.userEdit.studentParent,
    disciplines: state.disciplines.disciplines,
    teacherDisciplines: state.userEdit.teacherDisciplines
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserEditManagement)
);
