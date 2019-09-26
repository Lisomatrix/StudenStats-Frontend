import React, { Component } from 'react';
import { Tabs } from 'antd';
import AbsenceCalendar from './../../../components/calendar-components/absence-calendar';
import TestsCalendar from './../../../components/calendar-components/tests-calendar';
// import MealsCalendar from './../../../components/calendar-components/meals-calendar';
import { shallowEqual } from 'shouldcomponentupdate-children';

const { TabPane } = Tabs;

class Calendars extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		return (
			<div className="cal-container">
				<div className="animated slideInUp ant-card-bordered cal">
					<Tabs defaultActiveKey="1" size="large">
						<TabPane tab="Faltas" key="1">
							<AbsenceCalendar absences={this.props.absences} />
						</TabPane>
						<TabPane tab="Testes" key="2">
							<TestsCalendar tests={this.props.tests} role={this.props.role} />
						</TabPane>
						
					</Tabs>
				</div>
			</div>
		);
	}
}

export default Calendars;
