import React, { Component } from 'react';
import { shallowEqual } from 'shouldcomponentupdate-children';
import AbsenceMobileRow from './absence-mobile-row';

class AbsenceMobileTable extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		var students = [];
		var rows;

		if (this.props.data) {
			for (var i = 0; i < this.props.data.length; i++) {
				var exists = false;

				for (var x = 0; x < students.length; x++) {
					if (students[x].studentId === this.props.data[i].studentId) {
						exists = true;
					}
				}

				if (exists) {
					continue;
				} else {
					var absences = [];
					for (var x = 0; x < this.props.data.length; x++) {
						if (this.props.data[x].studentId === this.props.data[i].studentId) {
							absences.push({
								date: this.props.data[x].date,
								discipline: this.props.data[x].discipline,
								module: this.props.data[x].module,
								absence: this.props.data[x].absence,
								justified: this.props.data[x].justified
							});
						}
					}

					students.push({
						name: this.props.data[i].name,
						studentId: this.props.data[i].studentId,
						absences: absences
					});
				}
			}

			rows = students.map((student) => {
				return (
					<AbsenceMobileRow key={student.studentId} name={student.name} absences={student.absences} />
				);
			})
		}

		return (
			<div>
				<div>
					{rows}
				</div>
			</div>
		);
	}
}

export default AbsenceMobileTable;
