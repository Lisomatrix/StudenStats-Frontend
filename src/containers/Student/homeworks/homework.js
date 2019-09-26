import React from 'react';
import { connect } from 'react-redux';
import { Table, Modal } from 'antd';
import { requestClassHomeWorks } from './../../../redux/actions/restActions/homework';
import { requestClassDisciplines } from './../../../redux/actions/restActions/discipline';
import './../../../styles/homework-management.less';

function findHomeWork(homeworkId, homeworks) {

    for (var i = 0; i < homeworks.length; i++) {
        if (homeworks[i].homeworkId === homeworkId) {
            return homeworks[i];
        }
    }

    return undefined;
}

var dataFetched = false;

class Homeworks extends React.Component {

    state = {
        data: [],
        componentMount: true
    }

    columns = [
        {
            title: 'Título',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
            render: (text) => <span>{text}</span>
        },
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            render: (text) => <span>{text}</span>
        },
        {
            title: 'Prazo',
            dataIndex: 'expire',
            key: 'expire',
            width: '10%',
            render: (text) => <span>{text}</span>
        },
        {
            title: 'Disciplina',
            dataIndex: 'discipline',
            key: 'discipline',
            width: '10%',
            render: (text, row, index) => <span>{this._getDisciplineName(text)}</span>
        },
        {
            dataIndex: 'details',
            key: 'details',
            width: '10%',
            render: (text, row, index) => <a href="javascript:;" onClick={() => this._showHomeWorkInfo(row.id)}>Detalhes</a>
        },
    ]

    mobileColumns = [
        {
            title: 'Título',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
            render: (text) => <span>{text}</span>
        },
        {
            title: 'Disciplina',
            dataIndex: 'discipline',
            key: 'discipline',
            width: '10%',
            render: (text, row, index) => <span>{this._getDisciplineName(text)}</span>
        },
        {
            dataIndex: 'details',
            key: 'details',
            width: '10%',
            render: (text, row, index) => <a href="javascript:;" onClick={() => this._showHomeWorkInfo(row.id)}>Detalhes</a>
        },
    ]

    componentWillMount() {
        if (this.props.studentClass && !dataFetched) {
            this.props.requestClassHomeWorks(this.props.studentClass.classId);
            this.props.requestClassDisciplines(this.props.studentClass.classId);

            dataFetched = true;
        }
    }

    componentDidMount() {
        this.forceUpdate();
    }

    componentWillUpdate(nextProps, nextState) {
        if ((!this.props.homeworks && nextProps.homeworks) || (nextState.componentMount && nextProps.homeworks)) {

            const data = [];

            if (nextProps.homeworks)
                for (var i = 0; i < nextProps.homeworks.length; i++) {
                    const description = nextProps.homeworks[i].description.length > 80 ? nextProps.homeworks[i].description.substring(0, 80) + '...' : nextProps.homeworks[i].description

                    data.push({
                        title: nextProps.homeworks[i].title,
                        description: description,
                        expire: nextProps.homeworks[i].expireDate.replace(/-/g, "/"),
                        id: nextProps.homeworks[i].homeworkId,
                        key: nextProps.homeworks[i].homeworkId,
                        discipline: nextProps.homeworks[i].disciplineId,
                        class: nextProps.homeworks[i].classId,
                    });
                }

            nextState.data = data;
            nextState.componentMount = false;
        }


        if (nextProps.studentClass && !dataFetched) {
            nextProps.requestClassHomeWorks(nextProps.studentClass.classId);
            nextProps.requestClassDisciplines(nextProps.studentClass.classId);

            dataFetched = true;
        }
    }

    _getDisciplineName = (disciplineId) => {
        if (this.props.classDisciplines) {

            for (var i = 0; i < this.props.classDisciplines.length; i++) {
                if (disciplineId === this.props.classDisciplines[i].disciplineId) {
                    return this.props.classDisciplines[i].abbreviation
                }
            }
        }

        return '';
    }

    _showHomeWorkInfo = (value) => {
        const foundHomework = findHomeWork(value, this.props.homeworks);

        Modal.info({
            content: (
                <div className="homework-detail-model flex-column">
                    <div className="title-expire-container flex-row">
                        <div className="homework-model-title-container flex-column">
                            <h3>Título:</h3>
                            <span>{foundHomework.title}</span>
                        </div>
                        <div className="homework-model-date-container flex-column">
                            <h3>Prazo:</h3>
                            <span>{foundHomework.date}</span>
                        </div>
                    </div>
                    <div style={{ marginTop: '18px' }} className="homework-model-description-container flex-column">
                        <h3>Descrição:</h3>
                        <span>{foundHomework.description}</span>
                    </div>
                </div>
            )
        });
    }

    render() {
        return (
            <div className="homework-management-container">
                <div className="ant-card-bordered homework-management animated slideInUp">
                    <Table
                        style={{
                            marginLeft: '5px',
                            marginRight: '5px'
                        }}
                        columns={window.innerWidth > 500 ? this.columns : this.mobileColumns}
                        dataSource={this.state.data}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        absences: state.absences.absences,
        tests: state.tests.tests,
        studentClass: state.classes.studentClass,
        homeworks: state.homeworks.homeworks,
        classDisciplines: state.disciplines.classDisciplines,
    };
};

const mapDispatchToProps = {
    requestClassHomeWorks,
    requestClassDisciplines
};

export default connect(mapStateToProps, mapDispatchToProps)(Homeworks);