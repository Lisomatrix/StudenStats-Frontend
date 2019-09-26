import React, { Component } from 'react';
import { Card } from 'antd';
import { shallowEqual } from 'shouldcomponentupdate-children';
import { ChartCard, MiniProgress, WaterWave } from 'ant-design-pro/lib/Charts';

class HoursRecuperationGraph extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		var percentage = Math.round(
			this.props.recuperated / (this.props.recuperated + this.props.nonRecuperated) * 100
		);

		if (isNaN(percentage)) {
			percentage = 100;
		}

		return (
			// <Card hoverable bodyStyle={{ display: 'grid' }}>
			// 	<div className="graph-container">
			// 		<WaterWave
			// 			color={this.props.primaryColor}
			// 			height={150}
			// 			title="Horas Recuperadas"
			// 			percent={percentage}
			// 		/>
			// 	</div>
			// </Card>
			<ChartCard
			title="Horas Recuperadas"
			// action={
			// 	<Tooltip title="指标说明">
			// 		<Icon type="info-circle-o" />
			// 	</Tooltip>
			// }
			total={percentage + '%'}
			footer={
				<div style={{ fontSize: '12px' }}>
					<span>
						Recuperadas: {this.props.recuperated}
					</span>
					<span style={{ float: 'right' }}>
						Por recuperar: {this.props.nonRecuperated}
					</span>
				</div>
			}
			contentHeight={45}
		>
			<MiniProgress color={this.props.primaryColor} percent={percentage} strokeWidth={8} target={80} />
		</ChartCard>
		);
	}
}

export default HoursRecuperationGraph;
