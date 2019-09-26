import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { shallowEqual } from 'shouldcomponentupdate-children';

const FormItem = Form.Item;

class EmailReset extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	
	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<div className="inputs-container">
				<span>Introduza o seu email:</span>
				<FormItem hasFeedback className="form-item">
					{getFieldDecorator('email', {
						rules: [
							{ required: true, message: 'Introduza o seu email' },
							{ min: 8, message: 'O email tem que ter no minimo 8 caracteres' }
						]
					})(
						<Input
							disabled={this.props.isLoading ? true : false}
							className="input"
							prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="Email"
						/>
					)}
				</FormItem>
				<FormItem>
					<div style={{ color: '#f5222d' }}>{this.props.error}</div>
					<Button
						loading={this.props.isLoading ? true : false}
						type="primary"
						htmlType="submit"
						className="login-form-button"
					>
						Enviar email
					</Button>
					<div className="register-container">
						<a onClick={this.props.goBack} className="register-link">
							Cancelar
						</a>
					</div>
				</FormItem>
			</div>
		);
	}
}

export default EmailReset;
