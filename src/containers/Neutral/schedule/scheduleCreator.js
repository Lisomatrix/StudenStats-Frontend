import React, { Component } from 'react';
import './../../../styles/schedule-creator.less';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { requestTeacherSchedule } from './../../../redux/actions/restActions/schedule';

var classDisciplines;

function Column(props) {
	return (
		<div className={'schedule-column ' + props.columnClass ? props.columnClass : 'z'}>
			<div className={'column-header ' + props.headerClass}>
				<div className="column-text-container">
					<h3 className="text">{props.header ? props.header : ''}</h3>
				</div>

				<div className="classroom-divisor" />
			</div>
			<div className="column-rows">{props.rows}</div>
		</div>
	);
}

class Row extends Component {

	render() {
		var text;

		if(this.props.schedule) {
			if (!this.props.editable) {
				text = <span>{this.props.text}</span>;
			} else {
				if (this.props.editable && this.props.editMode) {
					const select = classDisciplines.map((discipline) => {
						return (
							<option key={discipline.disciplineId} value={discipline.disciplineId}>
								{discipline.abbreviation}
							</option>
						);
					});
	
					text = (
						<select className="input-reset" value={this.props.text} type="select">
							{select}
						</select>
					);
				} else {
					text = <span>{this.props.text}</span>;
				}
			}
		}

		return (
			<div className={'schedule-row ' + this.props.containerClass}>
				<div
					className={
						this.props.editable && this.props.editMode ? (
							'schedule-row-discipline-container schedule-row-classroom-container-editMode'
						) : (
							'schedule-row-discipline-container'
						)
					}
				>
					{text}
				</div>
				<div className="schedule-row-classroom-container">
					<span>C3</span>
				</div>
			</div>
		);
	}
}

class ScheduleCreator extends Component {
	state = {
		editMode: false,
		createMode: false
	};

	componentWillMount() {
		this.props.requestTeacherSchedule(this.props.teacherId);
	}

	getDiscipline = (disciplineId) => {
		for (var i = 0; i < this.props.disciplines.length; i++) {
			if (this.props.disciplines[i].disciplineId === disciplineId) {
				return this.props.disciplines[i].abbreviation;
			}
		}

		return '';
	};

	mapRow = (row, rows) => {
		for (var i = 0; i < rows.length; i++) {
			if (rows[i].hour.hourId === row.hourId) {
				const t = this.getDiscipline(rows[i].disciplineId);

				return <Row editable editMode={this.state.editMode} key={row.hourId} text={t} />;
			}
		}

		return <Row key={row.hourId} text="" />;
	};

	mapColumn = (day) => {
		var rows = [];
		var hours = [];

		for (var i = 0; i < this.props.schedule.length; i++) {
			if (this.props.schedule[i].day.scheduleDayId === day.scheduleDayId) {
				rows.push(this.props.schedule[i]);
			}
		}

		for (var i = 0; i < this.props.hours.length; i++) {
			hours.push(this.mapRow(this.props.hours[i], rows));
		}

		return <Column key={day.scheduleDayId} header={day.day} rows={hours} />;
	};

	generateTable = () => {
		var columns = [];

		for (var i = 0; i < this.props.days.length; i++) {
			columns.push(this.mapColumn(this.props.days[i]));
		}

		return columns;
	};

	startCreateMode = () => {
		this.setState({ createMode: true, editMode: true });
	};

	render() {
		classDisciplines = this.props.disciplines;

		const columns = this.generateTable();

		return (
			<div className="schedule-creator-container animated slideInUp">
				<div className="schedule-controls">
					<Button onClick={this.startCreateMode} type="primary">
						Criar Horario
					</Button>
				</div>

				<div className="schedule-creator">
					<div className="schedule-container">
						<div className="schedule">
							<Column
								header="Time"
								rows={
									<div>
										<Row text={'8:30-9:30'} />
										<Row text={'9:45-10:45'} />
										<Row text={'10:55-11:55'} />
										<Row text={'12:00-13:00'} />
										<Row text={'13:25-14:25'} />
										<Row text={'14:30-15:30'} />
										<Row text={'15:40-16:40'} />
										<Row text={'16:45-17:45'} />
									</div>
								}
							/>
							{columns}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = {
	requestTeacherSchedule
};

const mapStateToProps = (state) => {
	return {
		days: state.schedules.days,
		schedule: state.schedules.schedule.scheduleHourDAOList,
		hours: state.schedules.hours,
		disciplines: state.disciplines.classDisciplines,
		teacherId: state.authentication.userRoleId
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleCreator);
