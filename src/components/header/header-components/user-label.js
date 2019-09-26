import React, { Component } from 'react';
import { Icon, Avatar, Dropdown, Menu } from 'antd';
import MenuItem from './menu-item';
import './../../../styles/user-label.less';
import { connect } from 'react-redux';
import { logout } from './../../../redux/actions/authentication';
import { disconnectWebsocket } from './../../../redux/actions/websocket';
import { withRouter } from 'react-router-dom';
import { shallowEqual } from 'shouldcomponentupdate-children';

function menu(props) {
	return (
		<Menu>
			<Menu.Item>
				<MenuItem icon="user" text="Perfil" />
			</Menu.Item>
			<Menu.Item onClick={props.settings}>
				<MenuItem icon="setting" text="Definições" />
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item onClick={props.logout}>
				<MenuItem icon="logout" text="Terminar Sessão" />
			</Menu.Item>
		</Menu>
	);
}

class UserLabel extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	logout = () => {
		this.props.disconnectWebsocket();
		this.props.logout();
	};

	settings = () => {
		this.props.history.push('/settings');
	}

	render() {
		const menuProps = {
			logout: this.logout,
			settings: this.settings
		};

		const dropMenu = menu(menuProps);

		var reducedName = "";

		if(this.props.name) {

			const dividedNames = this.props.name.split(" ");

			reducedName += dividedNames[0] + " " + dividedNames[dividedNames.length - 1];
		}


		return (
			<Dropdown trigger={[ 'click' ]} overlay={dropMenu}>
				<div className="user-label-container">
					<div className="icon-container">
						{this.props.userPhoto ? 
							<Avatar className="icon" size="small" src={this.props.userPhoto} /> 
							:
							<Avatar className="icon" size="small" icon="user" src={this.props.userPhoto} />
						}
					</div>
					<div className="name-container">
						<span className="name">{reducedName}</span>
					</div>
					<div className="down-icon-container">
						<Icon type="down" />
					</div>
				</div>
			</Dropdown>
		);
	}
}

const mapDispatchToProps = {
	logout,
	disconnectWebsocket
};

const mapStateToProps = (state) => {
	return {
		userPhoto: state.authentication.userPhoto,
		name: state.connect.user.name
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserLabel));
