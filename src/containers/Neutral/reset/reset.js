import React, { Component } from 'react';
import { resetGetData, resetPostData } from './../../../redux/actions/reset';
import ResetEmail from './../../../components/reset-components/email-reset';
import ResetPassword from './../../../components/reset-components/password-reset';
import { Form, Steps } from 'antd';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import './../../../styles/reset.less';
import './../../../styles/login.less';
import { shallowEqual } from 'shouldcomponentupdate-children';

const Step = Steps.Step;

class Reset extends Component {
	constructor(props) {
		super(props);

		this.state = {
			key: '1',
			loginAnimationDone: false,
			backAnimationDone: false,
			goBack: false
		};
	}

	navigateLogin = () => {
		this.props.history.push('/login');
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (!this.props.getSuccess) {
					this.props.resetGetData(values.email);
				} else if (this.props.getSuccess) {
					const formValues = values;

					formValues.resetId = this.props.resetId;

					const promise = this.props.resetPostData(formValues);

					if (promise) {
						promise.then((success) => this.setState({ backAnimationDone: true }));
					}
				}
			}
		});
	};

	endAnimation = () => {
		this.setState({ loginAnimationDone: true, goBack: true });
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		var redirect = '';

		var animation = this.props.postSuccess ? 'bounceOutDown' : 'bounceInUp';

		if (this.state.backAnimationDone && !this.state.goBack) {
			animation = 'bounceOutDown';
		}

		if (this.props.postSuccess && !this.state.loginAnimationDone) {
			setTimeout(this.endAnimation, 1000);
		} else if (this.state.backAnimationDone) {
			setTimeout(this.endAnimation, 1000);
		}

		if (this.state.backAnimationDone && this.state.goBack) {
			this.props.history.push('/dashboard');
		}

		return (
			<div style={{ overflow: 'hidden' }} className="login-container reset">
				{redirect}
				<Form style={{ gridRow: '2/2', gridColumn: '2/2' }} onSubmit={this.handleSubmit} className={"login-form reset-form animated " + animation}>
					<Steps>
						<Step key="1" status={!this.props.getSuccess ? 'process' : ''} title="Email" />
						<Step key="2" status={this.props.getSuccess ? 'process' : 'wait'} title="Verificação" />
					</Steps>
					{!this.props.getSuccess ? (
						<ResetEmail
							goBack={() => this.setState({ backAnimationDone: true })}
							error={this.props.error}
							isLoading={this.props.isLoading}
							form={this.props.form}
						/>
					) : (
							''
						)}
					{this.props.getSuccess ? (
						<ResetPassword
							error={this.props.error}
							isLoading={this.props.isLoading}
							form={this.props.form}
						/>
					) : (
							''
						)}
				</Form>
			</div>
		);
	}
}

const ResetPage = Form.create()(Reset);

const mapDispatchToProps = {
	resetGetData,
	resetPostData
};

const mapStateToProps = (state) => {
	return {
		resetId: state.reset.resetId,
		isLoading: state.reset.isLoading,
		getSuccess: state.reset.getSuccess,
		error: state.reset.error,
		postSuccess: state.reset.postSuccess,
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPage));
