import React, { Component } from 'react';
import { Table, Popover, Select, Checkbox } from 'antd';
import { shallowEqual } from 'shouldcomponentupdate-children';
import { isUndefined } from 'util';
import AbsenceMobileTable from './absence-mobile-table';

const Option = Select.Option;

var mobileData = [];
var students = [];

function getDiscipline(id, disciplines) {
	for (var i = 0; i < disciplines.length; i++) {
		if (disciplines[i].disciplineId === id) {
			return disciplines[i].name;
		}
	}

	return undefined;
}

function getAbsenceType(id, absenceTypes) {
	for (var i = 0; i < absenceTypes.length; i++) {
		if (absenceTypes[i].absenceTypeId === id) {
			return absenceTypes[i].name;
		}
	}

	return undefined;
}

class AbsenceList extends Component {
	state = {
		selectedDiscipline: -1,
		selectedStudent: -1,
		selectedModule: -1,
		selectedAbsenceType: -1
	};

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	getAbsenceType = (id) => {
		for (var i = 0; i < this.props.absenceTypes; i++) {
			if (this.props.absenceTypes[i].absenceTypeId === id) {
				return this.props.absenceTypes[i].name;
			}
		}
	};

	getStudent = (studentId) => {
		for (var i = 0; i < this.props.class.students.length; i++) {
			if (this.props.class.students[i].studentId === studentId) {
				return this.props.class.students[i].name;
			}
		}

		return 'NOT FOUND';
	};

	getModule = (moduleId) => {
		for (var i = 0; i < this.props.class.modules.length; i++) {
			if (this.props.class.modules[i].moduleId === moduleId) {
				return this.props.class.modules[i];
			}
		}

		return 'NOT FOUND';
	};

	filterDiscipline = (discipline) => {
		if (this.state.selectedDiscipline === -1) {
			return true;
		}

		const selectedDiscipline = getDiscipline(this.state.selectedDiscipline, this.props.disciplines);

		if (isUndefined(selectedDiscipline)) {
			return false;
		} else if (selectedDiscipline === discipline) {
			return true;
		}

		return false;
	};

	filterAbsenceType = (absenceType) => {
		if (this.state.selectedAbsenceType === -1) {
			return true;
		}

		const selectedAbsenceType = getAbsenceType(this.state.selectedAbsenceType, this.props.absenceTypes);

		if (isUndefined(selectedAbsenceType)) {
		} else if (selectedAbsenceType === absenceType) {
			return true;
		}

		return false;
	};

	filterStudent = (student) => {
		if (this.state.selectedStudent === -1) {
			return true;
		} else if (this.state.selectedStudent === student) {
			return true;
		}

		return false;
	};

	filterModule = (module) => {
		if (this.state.selectedDiscipline !== -1) {
			const moduleName = this.getModule(module);

			if (this.state.selectedDiscipline === moduleName.disciplineId) {
				if (this.state.selectedModule === -1) {
					return true;
				} else if (this.state.selectedModule === module) {
					return true;
				}
			}
		}

		if (this.state.selectedModule === -1) {
			return true;
		} else if (this.state.selectedModule === module) {
			return true;
		}

		return false;
	};

	justifyAbsence = (e) => {
		const isChecked = e.target.checked;
		const absenceId = e.target.id;



		if (isChecked) {
			this.props.sendJustify(absenceId);
		}
	};

	recuperate = (e) => {
		const isChecked = e.target.checked;
		const absenceId = e.target.id;

		if (isChecked) {
			this.props.sendRecuperate(absenceId, isChecked);
		}
	};

	render() {
		var absenceTypesOptions;
		var moduleOptions;
		var studentOptions;
		var disciplineOptions;
		var data = [];

		if (this.props.absenceTypes) {
			absenceTypesOptions = this.props.absenceTypes.map((absenceType) => {
				var text = absenceType.name.toLowerCase();
				const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
				return (
					<Option key={absenceType.absenceTypeId} value={absenceType.absenceTypeId}>
						{capitalized}
					</Option>
				);
			});
		}

		if (this.props.class) {
			studentOptions = this.props.class.students.map((student) => {
				return (
					<Option key={student.studentId} value={student.studentId}>
						{student.name}
					</Option>
				);
			});

			moduleOptions = this.props.class.modules.map((modules) => {
				if (modules.name)
					if (
						modules.disciplineId === this.state.selectedDiscipline ||
						this.state.selectedDiscipline === -1
					) {
						return (
							<Option key={modules.moduleId} value={modules.moduleId}>
								{modules.name}
							</Option>
						);
					}
			});
		}

		if (this.props.disciplines) {
			disciplineOptions = this.props.disciplines.map((discipline) => {
				return (
					<Option key={discipline.disciplineId} value={discipline.disciplineId}>
						{discipline.name}
					</Option>
				);
			});
		}

		var count = 0;

		if (this.props.absences && this.props.class) {
			for (var i = 0; i < this.props.absences.length; i++) {
				if (this.props.absences[i].recuperated && this.props.absences[i].justified) continue;

				if (!this.filterDiscipline(this.props.absences[i].discipline)) continue;

				if (!this.filterAbsenceType(this.props.absences[i].absenceType)) continue;

				if (!this.filterStudent(this.props.absences[i].studentId)) continue;

				if (!this.filterModule(this.props.absences[i].moduleId)) continue;

				const studentName = this.getStudent(this.props.absences[i].studentId);
				const moduleName = this.getModule(this.props.absences[i].moduleId);
				// console.log(this.props.absences[i]);

				// if(this.props.absences[i].recuperated)
				data.push({
					key: this.props.absences[i].absenceId,
					name: studentName,
					discipline: this.props.absences[i].discipline,
					date: this.props.absences[i].date,
					module: moduleName.name,
					absence: this.props.absences[i].absenceType,
					justified: this.props.absences[i].justified,
					studentId: this.props.absences[i].studentId,
					recuperated: this.props.absences[i].recuperated
				});

				count++;
			}
		}

		const columns = [
			{
				title: 'Nome',
				dataIndex: 'name',
				key: 'name',
				render: (text, row, index) => {
					return <span>{text}</span>;
				}
			},
			{
				title: 'Disciplina',
				dataIndex: 'discipline',
				key: 'discipline',
				render: (text, row, index) => {
					return (
						<span>{text}</span>
						// <Popover content={text} title="Professora">
						// 	<a href="javascript:;">{text}</a>
						// </Popover>
					);
				}
			},
			{
				title: 'Data',
				dataIndex: 'date',
				key: 'date',
				render: (text, row, index) => {
					return <a href="javascript:;">{text.substring(0, 10)}</a>;
				}
			},
			{
				title: 'Módulo/UFCD',
				dataIndex: 'module',
				key: 'module',
				render: (text, row, index) => {
					return <span>{text}</span>;
				}
			},
			{
				title: 'Tipo de falta',
				dataIndex: 'absence',
				key: 'absence',
				render: (text, row, index) => {
					text = text.toLowerCase();
					const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
					return <span>{capitalized}</span>;
				}
			},
			{
				title: 'Justificada',
				dataIndex: 'justified',
				key: 'justified',
				render: (text, row, index) => {
					return <Checkbox id={row.key.toString()} onChange={this.justifyAbsence} checked={text} />;
				}
			},
			{
				title: 'Recuperada',
				dataIndex: 'recuperated',
				key: 'recuperated',
				render: (text, row, index) => {
					return <Checkbox id={row.key.toString()} onChange={this.recuperate} checked={text} />;
				}
			}
		];

		return (
			<div>
				<div className="absence-list-container animated slideInUp">
					<div className="absence-list-title-container">
						<h1 className="absence-list-title">{this.props.name}</h1>
					</div>
					<div className="ant-card-bordered absences-container">
						<div className="absence-list-filters-container">
							{window.innerWidth > 600 ? (
								<label style={{ gridRow: '1', gridColumn: '1' }}>Disciplina:</label>
							) : (
									''
								)}

							<Select
								value={this.state.selectedDiscipline}
								onChange={(val) => {
									this.setState({ selectedDiscipline: val, selectedModule: -1 });
								}}
								showSearch
								placeholder="Disciplina"
								className="discipline-filter-container"
							>
								<Option key={-1} value={-1}>
									Todos
							</Option>
								{disciplineOptions}
							</Select>
							{window.innerWidth > 600 ? (
								<label style={{ gridRow: '1', gridColumn: '2' }}>Módulo/UFCD:</label>
							) : (
									''
								)}

							<Select
								value={this.state.selectedModule}
								onChange={(val) => {
									this.setState({ selectedModule: val });
								}}
								showSearch
								placeholder="Módulo/UFCD"
								className="module-filter-container"
							>
								<Option key={-1} value={-1}>
									Todos
							</Option>
								{moduleOptions}
							</Select>
							{window.innerWidth > 600 ? <label style={{ gridRow: '1', gridColumn: '3' }}>Aluno:</label> : ''}

							<Select
								onChange={(val) => {
									this.setState({ selectedStudent: val });
								}}
								showSearch
								placeholder="Aluno"
								className="student-filter-container"
							>
								<Option key={-1} value={-1}>
									Todos
							</Option>
								{studentOptions}
							</Select>
							{window.innerWidth > 600 ? (
								<label style={{ gridRow: '1', gridColumn: '4' }}>Tipo de falta:</label>
							) : (
									''
								)}
							<Select
								onChange={(val) => {
									this.setState({ selectedAbsenceType: val });
								}}
								className="absences-type-filter-container"
								showSearch
								placeholder="Tipo de falta"
							>
								<Option key={-1} value={-1}>
									Todos
							</Option>
								{absenceTypesOptions}
							</Select>
							<div className="absences-counter-container">
								<span>Total: {count}</span>
							</div>
						</div>
						<div className="absence-list-table-container">
							{window.innerWidth > 600 ? (
								<Table
									columns={columns}
									dataSource={data}
									style={{
										paddingTop: '8px',
										paddingLeft: '18px',
										paddingRight: '18px'
									}}
								/>
							) : (
									<AbsenceMobileTable data={data} />
								)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AbsenceList;
