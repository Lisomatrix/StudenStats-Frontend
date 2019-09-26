import React, { Component } from 'react';
import { Calendar, Modal } from 'antd';
import './../../styles/absence-calendar.less';
import { shallowEqual } from 'shouldcomponentupdate-children';

function info(title, content) {
	Modal.info({
		title: title,
		content: <div>{content}</div>,
		onOk() {}
	});
}

class AbsenceCalendar extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	onSelect = (value) => {
		if (this.props.absences) {
			const foundAbsences = [];

			const selectedDay = value.date();
			const selectedMonth = value.month();
			const selectedYear = value.year();
			var absenceTime;

			this.props.absences.forEach((absence) => {
				const absenceDay = parseInt(absence.date.substring(0, 2));
				const absenceMonth = parseInt(absence.date.substring(3, 5));
				const absenceYear = parseInt(absence.date.substring(6, 10));
				absenceTime = absence.time;

				if (selectedDay === absenceDay && selectedMonth === absenceMonth - 1 && selectedYear === absenceYear) {
					foundAbsences.push(absence);
				}
			});

			if (foundAbsences.length > 0) {
				const displayAbsence = foundAbsences.map((absenceElement) => (
					// <p key={absenceElement.id}>{absenceElement.discipline + ' - ' + absenceTime}</p>
					<p key={absenceElement.id}>{absenceElement.discipline}</p>
				));

				info('Dia ' + selectedDay, displayAbsence);
			}
		}
	};

	getFaltaData = (value) => {
		if (this.props.absences) {
			const day = value.date();
			const month = value.month();
			const year = value.year();

			var absencesNumber = 0;

			this.props.absences.forEach((absence) => {
				
				const absenceDay = parseInt(absence.date.substring(0, 2));
				const absenceMonth = parseInt(absence.date.substring(3, 5));
				const absenceYear = parseInt(absence.date.substring(6, 10));

				if (day === absenceDay && month === absenceMonth - 1 && year === absenceYear) {
					absencesNumber++;
				}
			});

			return absencesNumber;
		} else {
			return;
		}
	};

	dateCellRender = (value) => {
		const absencesNumber = this.getFaltaData(value);

		return (
			<div className="absence-container">
				<span className="absence">{absencesNumber > 0 ? absencesNumber + ' Faltas' : null}</span>
			</div>
		);
	};

	render() {
		if (this.props.absences) {
			var index = 0;

			this.props.absences.forEach((element) => {
				element.id = index;
				index++;
			});
		}

		return <Calendar onSelect={this.onSelect} dateCellRender={this.dateCellRender} />;
	}
}

export default AbsenceCalendar;
