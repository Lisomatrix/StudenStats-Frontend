import React, { Component } from 'react';
import { Avatar, Checkbox, Divider } from 'antd';

function getAbsencesByDate(date, absences) {
	var absencesRows = [];

	for (var i = 0; i < absences.length; i++) {
		if (absences[i].date === date) {
			absencesRows.push({
				discipline: absences[i].discipline,
				module: absences[i].module,
				absence: absences[i].absence,
				justified: absences[i].justified
			});
		}
	}

	return absencesRows;
}

function adaptAbsences(absences) {
	var dates = [];

	for (var i = 0; i < absences.length; i++) {
		var exists = false;

		for (var x = 0; x < dates.length; x++) {
			if (absences[i].date === dates[x].date) {
				exists = true;
				break;
			}
		}

		if (exists) {
			continue;
		} else {
			const absencesByDate = getAbsencesByDate(absences[i].date, absences);

			dates.push({
				date: absences[i].date,
				absences: absencesByDate
			});
		}
	}

	return dates;
}

class AbsenceMobileRow extends Component {
	render() {
		var absencesRows = adaptAbsences(this.props.absences);

		var r = [];

		for (var i = 0; i < absencesRows.length; i++) {
			var count = -1;

			var rows = absencesRows[i].absences.map((val) => {
				++count;
				return (
					<div key={count} className="disciplines-container">
						<span>{val.module}</span>
						<span>{val.absence}</span>
						<Checkbox checked={val.justified} />
					</div>
				);
			});

			r.push(
				<div key={i} className="absence-row-container">
					<div className="date-container">
						<span>{absencesRows[i].date}</span>
					</div>
					<div className="table-headers-container">
						<span>Módulo/UFCD</span>
						<span>Tipo de falta</span>
						<span>Justificada</span>
					</div>

					{rows}
				</div>
			);
		}

		return (
			<div className="student-card">
				<div className="card-identity-container">
					<div className="photo-identity-container">
						<Avatar size={32} icon="user" />
					</div>
					<div className="name-identity-container">
						<span>{this.props.name}</span>
					</div>
				</div>
				<Divider />
				<div className="absences-list-container">{r}</div>
			</div>
		);
	}
}

export default AbsenceMobileRow;
