import React, { Component } from 'react';
import { Icon } from 'antd';
import './../../../styles/loading.less';

class Loading extends Component {
	render() {
		return (
			<div className="loading-container animated zoomIn">
				<Icon type="loading" style={{ fontSize: 46, gridColumn: '2/2' }} spin />
				{this.props.text ? (
					<h2
						className="loading"
						style={{ fontSize: 30, gridColumn: '2/2', gridRow: '2/2', paddingTop: '18px' }}
					>
						{this.props.text}
					</h2>
				) : (
					''
				)}
			</div>
		);
	}
}

export default Loading;
