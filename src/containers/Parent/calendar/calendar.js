import React from 'react';
import { Tabs } from 'antd';
import AbsenceCalendar from './../../../components/calendar-components/absence-calendar';
import TestsCalendar from './../../../components/calendar-components/tests-calendar';
import { shallowEqual } from 'shouldcomponentupdate-children';
import { connect } from 'react-redux';
import { requestParentAbsences } from './../../../redux/actions/restActions/absence';
import { requestChildTests } from './../../../redux/actions/restActions/test';

const { TabPane } = Tabs;

var dataFetched = false;
var testsFetched = false;

class ParentCalendar extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        return shallowEqual(this.props, nextProps, this.state, nextState);
    }

    componentWillMount() {
        if (!dataFetched) {
            this.props.requestParentAbsences();

            dataFetched = true;
        }
    }

    componentDidMount() {
        this.forceUpdate();
    }

    componentWillUpdate(nextProps, nextState) {
        if (!testsFetched && nextProps.students) {
            nextProps.requestChildTests(nextProps.students[0].studentId);

            testsFetched = true;
        }
    }

    render() {
        return (
            <div className="cal-container">
                <div className="ant-card-bordered cal animated slideInUp">
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

const mapStateToProps = (state) => {
    return {
        tests: state.tests.tests,
        absences: state.absences.absences,
        students: state.students.parentStudents
    };
};

const mapDispatchToProps = {
    requestParentAbsences,
    requestChildTests
};

export default connect(mapStateToProps, mapDispatchToProps)(ParentCalendar);