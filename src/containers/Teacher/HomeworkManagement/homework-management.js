import React from 'react';
import { shallowEqual } from 'shouldcomponentupdate-children';
import { connect } from 'react-redux';
import './../../../styles/homework-management.less';
import { Select, Modal, Input, DatePicker, Button, Table, message } from 'antd';
import { requestTeacherHomeWorks, requestMarkHomeWork } from './../../../redux/actions/restActions/homework';
import { requestTeacherDisciplines } from './../../../redux/actions/restActions/discipline';
// import HomeWorkList from './../../../components/homework-components/homework-list';
import moment from 'moment';

const TextArea = Input.TextArea;
const Option = Select.Option;

const tomorrowMoment = moment(new Date()).add(1, 'days');

var dataFetched = false;

function findHomeWork(homeworkId, homeworks) {

    for (var i = 0; i < homeworks.length; i++) {
        if (homeworks[i].homeworkId === homeworkId) {
            return homeworks[i];
        }
    }

    return undefined;
}

class HomeWorkManagement extends React.Component {

    state = {
        newHomeworkModalVisible: false,
        detailHomeworkModalVisible: false,
        selectedClass: -1,
        selectedDiscipline: -1,
        data: [],
        markHomeworkDescription: '',
        markHomeworkTitle: '',
        markHomeworkExpireDate: tomorrowMoment,
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
            title: 'Turma',
            dataIndex: 'class',
            key: 'class',
            width: '10%',
            render: (text, row, index) => <span>{this._getClassName(text)}</span>
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
            render: (text) => <span>{text}</span>
        },
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <span>{text}</span>
        },
        {
            dataIndex: 'details',
            key: 'details',
            width: '10%',
            render: (text, row, index) => <a href="javascript:;" onClick={() => this._showHomeWorkInfo(row.id)}>Detalhes</a>
        },
    ]

    componentWillMount() {
        if (!dataFetched) {
            this.props.requestTeacherHomeWorks(this.props.teacherId);
            dataFetched = true;
        }

        if(!this.props.teacherDisciplines) {
            this.props.requestTeacherDisciplines();
        }
    }

    componentDidMount() {
        this.forceUpdate();
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

    _changeMarkHomeworkExpireDate = (value) => {

        const today = new Date();
        const valueDate = value.toDate();

        if (today < valueDate) {
            this.setState({ markHomeworkExpireDate: value });
        } else {
            message.error('A data escolhida já passou!');
            this.setState({ markHomeworkExpireDate: tomorrowMoment });
        }
    }

    _markHomeWork = () => {

        if (!this.state.selectedClass) {
            message.error('Selecione uma turma!');
        } else if (!this.state.selectedDiscipline) {
            message.error('Selecione uma disciplina!');
        } else {

            var selectedDay = this.state.markHomeworkExpireDate.date();

            if (selectedDay < 10)
                selectedDay = '0' + selectedDay;

            var selectedMonth = this.state.markHomeworkExpireDate.month() + 1;

            if (selectedMonth < 10)
                selectedMonth = '0' + selectedMonth;

            const selectedYear = this.state.markHomeworkExpireDate.year();

            this.props.requestMarkHomeWork(this.state.selectedClass, {
                title: this.state.markHomeworkTitle,
                description: this.state.markHomeworkDescription,
                date: selectedYear + '-' + selectedMonth + '-' + selectedDay,
                disciplineId: this.state.selectedDiscipline
            })
                .then(() => { message.success('Trabalho de casa marcado!'); });

            this.setState({ newHomeworkModalVisible: false });
        }
    }

    _getDisciplineName = (disciplineId) => {
        if (this.props.teacherDisciplines) {
            for (var i = 0; i < this.props.teacherDisciplines.length; i++) {
                if (disciplineId === this.props.teacherDisciplines[i].disciplineId) {
                    return this.props.teacherDisciplines[i].abbreviation
                }
            }
        }

        return '';
    }

    _getClassName = (classId) => {
        if (this.props.classes) {
            for (var i = 0; i < this.props.classes.length; i++) {
                if (classId === this.props.classes[i].classId) {
                    return this.props.classes[i].name;
                }
            }
        }

        return '';
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowEqual(this.props, nextProps, this.state, nextState);
    }

    componentWillUpdate(nextProps, nextState) {

        if (nextState.componentMount || (!this.props.homeworks && nextProps.homeworks) || (this.props.homeworks && nextProps.homeworks && this.props.homeworks.length !== nextProps.homeworks.length) || this.state.selectedDiscipline !== nextState.selectedDiscipline || this.state.selectedClass !== nextState.selectedClass) {
            const data = [];

            if (nextProps.homeworks) {
                for (var i = 0; i < nextProps.homeworks.length; i++) {

                    var push = false;

                    push = nextProps.homeworks[i].disciplineId === nextState.selectedDiscipline && nextProps.homeworks[i].classId === nextState.selectedClass;

                    if (!push)
                        push = nextState.selectedDiscipline === -1 && nextState.selectedClass === -1;

                    if (!push)
                        push = nextProps.homeworks[i].disciplineId === nextState.selectedDiscipline && nextState.selectedClass === -1;

                    if (!push)
                        push = nextState.selectedDiscipline === -1 && nextProps.homeworks[i].classId === nextState.selectedClass;


                    if (push) {
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
                }
            }

            nextState.data = data;
            nextState.componentMount = false;
        }
    }

    render() {

        var avaibleClasses;
        var avaibleDisciplines;

        if (this.props.classes) {
            avaibleClasses = this.props.classes.map((item) => {
                return (
                    <Option key={item.classId} value={item.classId}>
                        {item.name}
                    </Option>
                );
            });
        }

        if (this.props.teacherDisciplines) {
            avaibleDisciplines = this.props.teacherDisciplines.map((item) => {
                return (
                    <Option key={item.disciplineId} value={item.disciplineId}>
                        {item.abbreviation}
                    </Option>
                );
            });
        }

        return (
            <div className="homework-management-container">
                <div className="ant-card-bordered homework-management animated slideInUp">
                    <div className="homework-management-selects-container">
                        <div className="select">
                            <label>Turma:</label>
                            <Select onChange={(value) => this.setState({ selectedClass: value })} placeholder="Turma...">
                                {avaibleClasses}
                                <Option value={-1}>
                                    Todos
                                </Option>
                            </Select>
                        </div>
                        <div className="select select-margin">
                            <label>Disciplina:</label>
                            <Select onChange={(value) => this.setState({ selectedDiscipline: value })} placeholder="Disciplina...">
                                {avaibleDisciplines}
                                <Option value={-1}>
                                    Todos
                                </Option>
                            </Select>
                        </div>
                        <div className="new-homework-btn-container">
                            <Button className="new-homework-btn" onClick={() => this.setState({ newHomeworkModalVisible: true })} type="primary">Novo Trabalho</Button>
                        </div>
                    </div>

                    <div className="homework-management-list-container">
                        <Table
                            style={{
                                marginLeft: (window.innerWidth > 600 ? '5px' : '0'),
                                marginRight: (window.innerWidth > 600 ? '5px' : '0')
                            }}
                            rowClassName="table-column-overflow"
                            childrenColumnName="table-column-overflow"
                            columns={window.innerWidth > 600 ? this.columns : this.mobileColumns}
                            dataSource={this.state.data}
                        />
                    </div>
                </div>

                <Modal
                    title="Marcar Trabalho para Casa"
                    visible={this.state.newHomeworkModalVisible}
                    okText="Marcar"
                    onOk={this._markHomeWork}
                    onCancel={() => this.setState({ newHomeworkModalVisible: false })}
                >
                    <div className="homework-modal-content-container flex-column">
                        <div className="title-expire-container flex-row">
                            <div className="homework-model-title-container flex-column">
                                <label>Título:</label>
                                <Input onChange={(value) => this.setState({ markHomeworkTitle: value.target.value })} placeholder="Título..." />
                            </div>
                            <div className="homework-model-date-container flex-column">
                                <label>Prazo:</label>
                                <DatePicker format="DD-MM-YYYY" value={this.state.markHomeworkExpireDate} onChange={this._changeMarkHomeworkExpireDate} placeholder="Prazo..." />
                            </div>
                        </div>
                        <div className="homework-model-description-container flex-column">
                            <label>Descrição:</label>
                            <TextArea onChange={(value) => this.setState({ markHomeworkDescription: value.target.value })} rows={8} />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapDispatchToProps = {
    requestTeacherHomeWorks,
    requestMarkHomeWork,
    requestTeacherDisciplines
};

const mapStateToProps = (state) => {
    return {
        classes: state.classes.classes,
        teacherId: state.authentication.userRoleId,
        teacherDisciplines: state.disciplines.teacherDisciplines,
        students: state.students.students,
        homeworks: state.homeworks.homeworks
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeWorkManagement);