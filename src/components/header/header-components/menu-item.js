import React, { Component } from 'react';
import { Icon } from 'antd';
import './../../../styles/menu-item.less';
import { shallowEqual } from 'shouldcomponentupdate-children';

class Menuitem extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		return (
			<div className="menu-item">
				<div className="menu-item-icon-container">
					<Icon type={this.props.icon} />
				</div>
				<div className="menu-item-title-container">
					<span>{this.props.text}</span>
				</div>
			</div>
		);
	}
}

export default Menuitem;
