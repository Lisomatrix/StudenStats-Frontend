import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { shallowEqual } from 'shouldcomponentupdate-children';

const FormItem = Form.Item;

class ResetPassword extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<div className="inputs-container">
				<FormItem hasFeedback className="form-item">
					{getFieldDecorator('resetCode', {
						rules: [
							{ required: true, message: 'Introduza o código de recuperação' },
							{ min: 5, message: 'O código tem que ter no minimo 5 caracteres' }
						]
					})(
						<Input
							maxLength="5"
							disabled={this.props.isLoading ? true : false}
							className="input"
							prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="Código de recuperação"
						/>
					)}
				</FormItem>
				<FormItem hasFeedback className="form-item">
					{getFieldDecorator('password', {
						rules: [
							{ required: true, message: 'Introduza a sua senha' },
							{ min: 8, message: 'A senha tem que ter no minimo 8 caracteres' }
						]
					})(
						<Input
							disabled={this.props.isLoading ? true : false}
							className="input"
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="Nova Senha"
							type="password"
						/>
					)}
				</FormItem>
				<FormItem hasFeedback className="form-item">
					{getFieldDecorator('rePassword', {
						rules: [
							{ required: true, message: 'Introduza a sua senha' },
							{ min: 8, message: 'A senha tem que ter no minimo 8 caracteres' }
						]
					})(
						<Input
							disabled={this.props.isLoading ? true : false}
							className="input"
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="Reintroduza a senha"
							type="password"
						/>
					)}
				</FormItem>
				<div style={{ color: '#f5222d', marginBottom: '15px' }}>{this.props.error}</div>
				<Button
					loading={this.props.isLoading ? true : false}
					type="primary"
					htmlType="submit"
					className="login-form-button"
				>
					Renovar a senha
				</Button>
			</div>
		);
	}
}

export default ResetPassword;
