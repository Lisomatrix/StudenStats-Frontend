import React, { Component } from 'react';
import { Avatar, List } from 'antd';
import { shallowEqual } from 'shouldcomponentupdate-children';

class NotificationContent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [
				{ avatar: 'U', title: 'New Message', description: 'New Message Descriptions' },
				{ avatar: 'U', title: 'New Message', description: 'New Message Descriptions' }
			]
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		return (
			<div className="notification-content-container">
				<List
					itemLayout="horizontal"
					dataSource={this.state.data}
					renderItem={(item) => (
						<List.Item>
							<List.Item.Meta
								avatar={
									<Avatar
										style={{ backgroundColor: 'orange', verticalAlign: 'middle' }}
										size="default"
									>
										{item.avatar}
									</Avatar>
								}
								title={item.title}
								description={item.description}
							/>
						</List.Item>
					)}
				/>
			</div>
		);
	}
}

export default NotificationContent;
