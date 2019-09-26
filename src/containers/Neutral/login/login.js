import React, { Component } from 'react';
import './../../../styles/login.less';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { loginPostData, rememberPostData } from './../../../redux/actions/authentication';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { shallowEqual } from 'shouldcomponentupdate-children';

const FormItem = Form.Item;

const LogoIcon = () => (
	<svg
		version="1.0"
		xmlns="http://www.w3.org/2000/svg"
		width="50px"
		height="50px"
		viewBox="0 0 102.000000 154.000000"
		preserveAspectRatio="xMidYMid meet"
	>
		<g transform="translate(0.000000,154.000000) scale(0.100000,-0.100000)" fill="rgba(0, 0, 0, 0.65)" stroke="none">
			<path d="M338 1458 c-76 -33 -138 -64 -138 -68 0 -4 22 -17 50 -29 l49 -21 -1
					-113 c-1 -95 2 -121 21 -170 40 -102 103 -157 181 -157 78 0 141 55 181 157
					19 49 22 75 21 170 l-1 113 49 21 c28 12 50 25 50 29 0 11 -278 130 -303 129
					-12 0 -84 -27 -159 -61z m76 -253 c31 -14 70 -25 86 -25 16 0 55 11 86 25 31
					14 58 25 60 25 2 0 4 -18 4 -40 0 -29 4 -40 15 -40 18 0 13 -31 -17 -100 -54
					-127 -172 -159 -254 -68 -29 31 -60 95 -68 140 -6 32 -4 37 9 32 12 -5 15 2
					15 35 0 23 2 41 4 41 2 0 29 -11 60 -25z"
			/>
			<path d="M265 908 c-78 -27 -144 -99 -169 -185 l-7 -23 411 0 412 0 -7 28
					c-20 80 -120 176 -198 189 -33 5 -35 4 -70 -58 -53 -94 -93 -150 -100 -142
					-13 13 -7 94 8 109 25 25 18 29 -45 29 -62 0 -70 -4 -45 -25 15 -13 22 -100 8
					-114 -8 -8 -111 147 -119 181 -7 25 -29 29 -79 11z"
			/>
			<path d="M58 669 c-41 -23 -41 -41 -3 -262 20 -117 43 -222 51 -234 8 -12 29
					-25 46 -28 18 -3 188 -5 376 -3 336 3 344 3 361 24 11 14 29 94 54 238 39 227
					39 243 -3 266 -25 14 -859 13 -882 -1z m886 -31 c13 -21 11 -45 -23 -237 -30
					-169 -41 -217 -56 -227 -15 -11 -89 -14 -367 -14 -335 0 -349 1 -368 20 -11
					11 -20 26 -20 33 -1 6 -16 100 -35 207 -30 174 -32 197 -19 218 l14 22 430 0
					430 0 14 -22z"
				/>
			<path d="M120 115 c0 -13 49 -15 380 -15 331 0 380 2 380 15 0 13 -49 15 -380 15 -331 0 -380 -2 -380 -15z" />
		</g>
	</svg>
);

class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loginAnimationDone: false,
			navigateToRegister: false,
			navigateToReset: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.props.loginPostData(values);
			}
		});
	};

	navigateRegister = () => {
		this.setState({ navigateToRegister: true });

		setTimeout(() => {
			this.props.history.push('/register');
		}, 1000);
	};

	navigateReset = () => {
		this.setState({ navigateToReset: true });

		setTimeout(() => {
			this.props.history.push('/reset');
		}, 1000);
	};

	endAnimation = () => {
		this.setState({ loginAnimationDone: true});
	}

	render() {
		var animation = this.props.authorized ? 'bounceOutUp' : 'bounceInDown';

		if (this.props.authorized && this.state.loginAnimationDone) {
			this.props.history.push('/dashboard');
		}

		if (this.props.authorized && !this.state.loginAnimationDone) {
			setTimeout(this.endAnimation, 1000);
		}

		if(this.state.navigateToRegister) {
			animation = 'bounceOutUp';
			setTimeout(this.endAnimation, 1000);
		} else if(this.state.navigateToReset) {
			animation = 'bounceOutUp';
			setTimeout(this.endAnimation, 1000);
		}

		const { getFieldDecorator } = this.props.form;

		return (
			<div className="login-container">
				<Form style={{ gridRow: '2/2', gridColumn: '2/2'}} onSubmit={this.handleSubmit} className={'login-form animated ' + animation}>
					<div className="login-logo-container">
						<Icon className="logo-icon-container" component={LogoIcon} />
						<span className="logo-title-container">StudenStats</span>
					</div>
					<div className="inputs-container">
						<FormItem hasFeedback className="form-item">
							{getFieldDecorator('userName', {
								rules: [
									{ required: true, message: 'Introduza o seu email' },
									{ min: 8, message: 'O email tem que ter no minimo 8 caracteres' },
									{ type: 'email', message: 'Email inválido!' }
								]
							})(
								<Input
									type="email"
									disabled={this.props.isLoading ? true : false}
									className="input"
									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Email"
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
									placeholder="Senha"
									type="password"
								/>
							)}
						</FormItem>
						<FormItem className="form-item">
							{getFieldDecorator('remember', {
								valuePropName: 'checked',
								initialValue: true
							})(
								<Checkbox
									disabled={this.props.isLoading ? true : false}
									className="login-form-checkbox"
								>
									Lembrar-me
								</Checkbox>
							)}
							<a onClick={this.navigateReset} className="login-form-forgot">
								Recuperar Senha
							</a>
							<div style={{ color: '#f5222d' }}>{this.props.error}</div>
							<Button
								loading={this.props.isLoading ? true : false}
								type="primary"
								htmlType="submit"
								className="login-form-button"
							>
								Log in
							</Button>
							<div className="register-container">
								<a onClick={this.navigateRegister} className="register-link">
									Registar
								</a>
							</div>
						</FormItem>
					</div>
				</Form>
			</div>
		);
	}
}
const LoginPage = Form.create()(Login);

const mapStateToProps = (state) => {
	return {
		isLoading: state.authentication.isLoading,
		authorized: state.authentication.authorized,
		error: state.authentication.error
	};
};

const mapDispatchToProps = {
	loginPostData,
	rememberPostData
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage));
