import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Redirect, BrowserRouter as Router, Route } from 'react-router-dom';
import { rememberPostData } from './../../../redux/actions/authentication';
import Test from './../test/test';
import Loading from './../loading/loading';
import Loadable from 'react-loadable';
import { shallowEqual } from 'shouldcomponentupdate-children';

const PrivateRoute = ({ component: Component, ...rest, authorized }) => (
	<Route {...rest} render={(props) => (authorized === true ? <Component {...props} /> : <Redirect to="/login" />)} />
);

const Home = Loadable({
	loader: () => import('./../home/home'),
	loading: Loading,
});

const LoginPage = Loadable({
	loader: () => import('./../login/login'),
	loading: Loading,
});

const RegisterPage = Loadable({
	loader: () => import('./../register/register'),
	loading: Loading
});

const Reset = Loadable({
	loader: () => import('./../reset/reset'),
	loading: Loading
});

class AppRouter extends Component {


	componentWillMount() {
		const token = localStorage.getItem('token');

		if(token !== null) {
			this.props.rememberPostData();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/login" render={() => <LoginPage />} />
					<Route exact path="/register" render={() => <RegisterPage />} />
					<Route exact path="/reset" render={() => <Reset />} />
					<PrivateRoute authorized={this.props.authorized} path="/" component={Home} />
					<PrivateRoute authorized={this.props.authorized} path="/upload" component={Test} />
					<Route path="*" render={() => <h1>404</h1>} />
				</Switch>
			</Router>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		authorized: state.authentication.authorized,
		role: state.authentication.role
	};
};

const mapDispatchToProps = {
	rememberPostData
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
