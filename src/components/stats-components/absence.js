import React, { Component } from 'react';
import { Card, Icon } from 'antd';
import './../../styles/absence.less';
import { shallowEqual } from 'shouldcomponentupdate-children';
import CountUp from 'react-countup';

function getIcon(absenceNumber) {
	var icon;

	if (absenceNumber >= 10) {
		icon = 'frown';
	} else if (absenceNumber >= 5) {
		icon = 'meh';
	} else {
		icon = 'smile';
	}

	return <Icon className="icon" type={icon} theme="filled" />;
}

function backColor(notes) {
	var color;

	if (notes >= 10) {
		color = 'green-card';
	} else if (notes >= 5) {
		color = 'yellow-card';
	} else {
		color = 'red-card';
	}

	return color;
}

class AbsenceCard extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		return (
			<Card className={'absence-card ' + backColor(this.props.notes)} title="Faltas" hoverable bordered>
				<div className="display-container">
					<div className="icon-container">{getIcon(this.props.absencesNumber)}</div>
					<div className="text-container">
						<CountUp
							className="text"
							end={parseInt(this.props.absencesNumber)}
							duration={2}
						/>
					</div>
				</div>
			</Card>
		);
	}
}

export default AbsenceCard;
