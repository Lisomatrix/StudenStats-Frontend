import React, { Component } from 'react';
import { Card } from 'antd';
import { shallowEqual } from 'shouldcomponentupdate-children';
import { ChartCard, MiniProgress, WaterWave } from 'ant-design-pro/lib/Charts';

class ModulesGraph extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		var percentage = Math.round(this.props.passed / (this.props.passed + this.props.nonPassed) * 100);

		if (isNaN(percentage)) {
			percentage = 100;
		}

		return (
			// <Card hoverable bodyStyle={{ display: 'grid' }}>
			// 	<div style={{ margin: 'auto', textAlign: 'center' }}>
			// 		<WaterWave
			// 			color={this.props.primaryColor}
			// 			height={150}
			// 			title="Modulos Realizados"
			// 			percent={percentage}
			// 		/>
			// 	</div>
			// </Card>
			<ChartCard
			title="Módulos/UFCD"
			// action={
			// 	<Tooltip title="指标说明">
			// 		<Icon type="info-circle-o" />
			// 	</Tooltip>
			// }
			total={percentage + '%'}
			footer={
				<div style={{ fontSize: '12px' }}>
					<span>
						Feitos: {this.props.passed}
					</span>
					<span style={{ float: 'right' }}>
						A recuperar: {this.props.nonPassed}
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

export default ModulesGraph;
