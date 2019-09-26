import React, { Component } from 'react';
import { Icon, Drawer } from 'antd';
import NotificationContent from './notification-content';
import { shallowEqual } from 'shouldcomponentupdate-children';

class Notification extends Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	onClose = () => {
		this.setState({
			visible: false
		});
	};

	showDrawer = () => {
		this.setState({
			visible: true
		});
	};

	render() {
		return (
			<div>
				<div onClick={this.showDrawer} className="notification-container">
					<Icon type="bell" />
				</div>
				<Drawer
					title="Notificações"
					placement="right"
					closable={true}
					visible={this.state.visible}
					onClose={this.onClose}
				>
					<NotificationContent />
				</Drawer>
			</div>
		);
	}
}

export default Notification;
