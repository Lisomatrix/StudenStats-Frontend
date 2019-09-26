import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts'
import { Card, Select } from 'antd';
import { shallowEqual } from 'shouldcomponentupdate-children';
import { ChartCard } from 'ant-design-pro/lib/Charts';

const Option = Select.Option;

const cols = {
	month: {
		range: [0, 1]
	}
};

function getReasonableHeight() {
	if (window.innerHeight >= 1080) {
		return 600;
	} else if (window.innerHeight <= 1080) {
		if (window.innerHeight >= 900) {
			return 460;
		} else {
			return 260;
		}
	}
}

function getOrderedData(propData, singleLine) {
	const data = [];

	if (propData) {
		for (var i = 0; i < propData.length; i++) {
			if (propData[i].moduleId !== undefined) {

				if (singleLine) {
					data.push({
						moduleId: propData[i].moduleId,
						month: propData[i].month,
						city: "Nota",
						nota: propData[i].Máxima
					});
				} else {
					data.push({
						moduleId: propData[i].moduleId,
						month: propData[i].month,
						city: "Mínima",
						nota: propData[i].Mínima
					});

					data.push({
						moduleId: propData[i].moduleId,
						month: propData[i].month,
						city: "Média",
						nota: propData[i].Média
					});

					data.push({
						moduleId: propData[i].moduleId,
						month: propData[i].month,
						city: "Máxima",
						nota: propData.Máxima
					});
				}
			}
		}
	}

	return data;
}

function getAvailabeDisciplinesOptions(disciplines) {

	if (!disciplines) {
		return [];
	}

	return disciplines.map((item) => {
		return (
			<Option key={item.disciplineId} value={item.disciplineId}>
				{item.abbreviation}
			</Option>
		);
	})
}

class GradesGraph extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDiscipline: null,
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	componentWillMount() {
		const { disciplines, onDisciplinesChange } = this.props;

		if (disciplines && disciplines.length > 0) {
			this.setState({ selectedDiscipline: disciplines[0].disciplineId }, () => {
				onDisciplinesChange(disciplines[0].disciplineId);
			});
		}
	}

	componentDidUpdate(nextProps, nextState) {
		const { selectedDiscipline } = nextState;
		const { disciplines } = nextProps;

		if (!selectedDiscipline && disciplines && disciplines.length > 0) {
			nextState.selectedDiscipline = disciplines[0].disciplineId
		}
	}

	handleDisciplinaChange = (value) => {
		const { onDisciplinesChange } = this.props;

		this.setState({ selectedDiscipline: value }, () => {
			onDisciplinesChange(value);
		});
	};

	render() {
		const { propData, singleLine, disciplines } = this.props;

		const data = getOrderedData(propData, singleLine);
		const height = getReasonableHeight();
		const avaibleDisciplines = getAvailabeDisciplinesOptions(disciplines);
		return (
			<div style={{ maxHeight: height + 50 }} className="grades-graph-container">
				<ChartCard
					title="Evolução das Notas"
					action={
						<div style={{ float: 'right' }}>
							<span style={{ marginRight: '5px' }}>Disciplina:</span>
							<Select onChange={this.handleDisciplinaChange} value={this.props.selectedDiscipline} placeholder="Disciplina" style={{
								minWidth: '100px'
							}}>
								{avaibleDisciplines}
							</Select>
						</div>
					}
				>
					<Chart
						padding={[10, 15, 20, 30]}
						height={height}
						className="grades-graph"
						data={data}
						scale={cols}
						forceFit
					>
						<Legend />
						<Axis name="month" />
						<Axis
							name="nota"
							label={{
								formatter: (val) => `${val}`
							}}
						/>
						<Tooltip
							crosshairs={{
								type: 'y'
							}}
						/>
						<Geom type="line" position="month*nota" size={2} color={'city'} shape={'smooth'} />
						<Geom
							type="point"
							position="month*nota"
							size={4}
							shape={'circle'}
							color={'city'}
							style={{
								stroke: '#fff',
								lineWidth: 1
							}}
						/>
					</Chart>
				</ChartCard>
			</div>
		);
	}
}

export default GradesGraph;
