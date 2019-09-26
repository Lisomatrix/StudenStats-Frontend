import React, { Component } from 'react';
import UserLabel from './header-components/user-label';
import Notification from './header-components/notification';
import { Layout, Icon } from 'antd';
import { shallowEqual } from 'shouldcomponentupdate-children';

const { Header } = Layout;

class Topbar extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {

		var width;

		if(window.innerWidth > 900) {
			width = this.props.collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
		} else {
			width = '100%'
		}

		return (
			<Header style={{ width: width }} className="header animated slideInDown">
				<Icon
					style={{ paddingTop: '4px' }}
					className="trigger"
					type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
					onClick={this.props.toggle}
				/>
				<div className="user-options-container">
					<Notification />
					<UserLabel />
				</div>
			</Header>
		);
	}
}

export default Topbar;
