import React, { Component } from 'react';
import './../../../styles/schedule-container.less'
import ScheduleCreator from './scheduleCreator';

function Column(props) {
    return (
        <div className={"schedule-column " + props.columnClass} style={{ gridColumn: props.column }}>
            <div className={"column-header " + props.headerClass}>
                <h3 className="text">{props.header}</h3>
            </div>
            <div className="column-rows">
                {props.rows}
            </div>
        </div>
    );
}

function Row(props) {
    return (
        <div className={"schedule-row " + props.containerClass}>
            <span>{props.text}</span>
        </div>
    );
}

class Schedule extends Component {

    render() {

        return (
            <ScheduleCreator/>
            // <div className="schedule-container animated slideInUp">
            //     <div className="schedule">
            //         <Column header="Time" column={1} rows={
            //             <div>
            //                 <Row text={'8:30-9:30'} />
            //                 <Row text={'9:45-10:45'} />
            //                 <Row text={'10:55-11:55'} />
            //                 <Row text={'12:00-13:00'} />
            //             </div>
            //         } />
            //         <Column column={2} header="Segunda" rows={<div><Row text={'row1'} /> <Row text={'row2'} /></div>} />
            //         <Column column={3} header="Terça" rows={<div><Row text={'row1'} /> <Row text={'row2'} /></div>} />
            //         <Column column={4} header="Quarta" rows={<div><Row text={'row1'} /> <Row text={'row2'} /></div>} />
            //         <Column column={5} header="Quinta" rows={<div><Row text={'row1'} /> <Row text={'row2'} /></div>} />
            //         <Column column={6} header="Sexta" rows={<div><Row text={'row1'} /> <Row text={'row2'} /></div>} />
            //     </div>
            // </div>
        );
    }
}

export default Schedule;