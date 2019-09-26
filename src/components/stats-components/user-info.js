import React, { Component } from 'react';
import { Card, Avatar } from 'antd';
import { shallowEqual } from 'shouldcomponentupdate-children';

class UserInfo extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		return (
			<Card className="absence-card user-info-card" title="Aluno" hoverable bordered>
				<div className="display-container">
					<div className="icon-container">
						<Avatar className="icon" size={64} src={this.props.image} />
					</div>
					<div className="text-container username-text-container">
						<span className="username-text">{this.props.name}</span>
					</div>
				</div>
			</Card>
		);
	}
}

export default UserInfo;
