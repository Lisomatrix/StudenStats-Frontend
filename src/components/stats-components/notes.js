import React, { Component } from 'react';
import { Card, Icon } from 'antd';
import { shallowEqual } from 'shouldcomponentupdate-children';

function backColor(notes) {
	var color;

	if (notes >= 16) {
		color = 'green-card';
	} else if (notes >= 10) {
		color = 'yellow-card';
	} else {
		color = 'red-card';
	}
	
	return color;
}

class Notes extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		return (
			<Card className={'absence-card ' + backColor(this.props.notes)} title="Média" hoverable bordered>
				<div className="display-container">
					<div className="icon-container">
						<Icon className="icon" type="book" theme="outlined" />
					</div>
					<div style={{ paddingTop: '0px' }} className="text-container">
						<span className="text">{this.props.notes}</span>
					</div>
				</div>
			</Card>
		);
	}
}

export default Notes;
