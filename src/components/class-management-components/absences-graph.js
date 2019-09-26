import React, { Component } from 'react';
import { Icon, Tooltip } from 'antd';
import { shallowEqual } from 'shouldcomponentupdate-children';
import { ChartCard, MiniProgress, WaterWave } from 'ant-design-pro/lib/Charts';

class AbsenceGraph extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		var percentage = Math.round(this.props.justified / (this.props.justified + this.props.nonJustified) * 100);
		
		if (isNaN(percentage)) {
			percentage = 100;
		}

		return (
			// <Card hoverable bodyStyle={{ display: 'grid' }}>
			// 	<div className="graph-container">
			// 		<WaterWave
			// 			className="graph"
			// 			color={this.props.primaryColor}
			// 			height={150}
			// 			title="Faltas Justificadas"
			// 			percent={percentage}
			// 		/>
			// 	</div>
			// </Card>
			<ChartCard
			
				// action={<Tooltip title="More info"><Icon type="info-circle-o" /></Tooltip>}
				title="Faltas Justificadas"
				// action={
				// 	<Tooltip title="指标说明">
				// 		<Icon type="info-circle-o" />
				// 	</Tooltip>
				// }
				total={percentage + '%'}
				footer={
					<div style={{ fontSize: '12px' }}>
						<span>
							Justificadas: {this.props.justified}
						</span>
						<span style={{ float: 'right' }}>
							Injustificadas: {this.props.nonJustified}
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

export default AbsenceGraph;
