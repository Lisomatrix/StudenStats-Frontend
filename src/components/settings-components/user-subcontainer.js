import React from "react";
import { config } from "./../../constants/config";
import { Form, Icon, Upload, Input, message, Button } from "antd";
import { shallowEqual } from 'shouldcomponentupdate-children';
import { Prompt } from 'react-router-dom';
import "./../../styles/user-management.less";

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

            const action = config.httpServerURL + "/user/photo";

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

class UserSubcontainer extends React.Component {

    state = {
        changed: false
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowEqual(this.props, nextProps, this.state, nextState);
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
            console.log(err);
            if (err) {
                return;
            }

            const updateUser = {
                name: values.name,
                address: values.address,
                phoneNumber: values.phoneNumber ? values.phoneNumber : "",
                roleId: this.props.user.roleEntityId,
                email: values.email
            };

            console.log(this.props.role);

            if (this.props.role === "ROLE_ALUNO") {
                this.props.requestUpdateStudent(updateUser, this.props.user.userId);
            } else if (this.props.role === "ROLE_PARENT") {
                this.props.requestUpdateParent(updateUser, this.props.user.userId);
            } else if (this.props.role === "ROLE_ADMIN") {
                this.props.requestUpdateAdmin(updateUser, this.props.user.userId);
            } else if (this.props.role === "ROLE_PROFESSOR") {
                this.props.requestUpdateTeacher(updateUser, this.props.user.userId);
            }
        });
    };

    render() {
        return (
            <div className="user-subcontainer">
                <Prompt
                    when={this.state.changed}
                    message={(location) => `O tema não foi guardado tem a certeza que pretende sair?`}
                />
                <UserForm
                    wrappedComponentRef={this._saveFormRef}
                    name={this.props.user.name}
                    imgUrl={this.props.userPhoto}
                    email={this.props.user.email}
                    address={this.props.user.address}
                    phoneNumber={this.props.user.phoneNumber}
                    handleUploadChange={this.handleChange}
                />
                <div style={{ width: '100%', height: '30px' }}>
                    <Button onClick={this._saveEdits} type="primary" style={{ float: 'right' }}>Guardar</Button>
                </div>
            </div>
        );
    }
}

export default UserSubcontainer;