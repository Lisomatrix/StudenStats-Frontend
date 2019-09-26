import React from 'react';
import { connect } from 'react-redux';
import './../../../styles/students-tests.less';
import { Select, Table } from 'antd';
import { requestChildClass } from './../../../redux/actions/restActions/class';
import { requestModulesByClass } from './../../../redux/actions/restActions/module';
import { requestChildModuleGrades, requestChildTestGrades } from './../../../redux/actions/restActions/grade';
import { requestClassDisciplines } from './../../../redux/actions/restActions/discipline';
import { requestClassTests, requestChildTests } from './../../../redux/actions/restActions/test';

const Option = Select.Option;

var dataFetched = false;
var testsFetched = false;
var delay = 0;

const ModuleGradeCard = props => {
    return (
    <div style={{ animationDelay: '0.' + props.delay + 's'}} className="module-grade-card-container animated slideInLeft">
      <div className="flex-row">
          <div style={{ width: '100%', padding: '2px', paddingBottom: '4px' }}>
              <span><b>Disciplina:</b></span><br />
              <span>{props.discipline}</span>
          </div>
      </div>
      <div className="flex-row">
      <div style={{ width: '100%', padding: '2px', paddingBottom: '4px'}}>
              <span><b>Módulo/UFCD:</b> {props.module}</span>
          </div>
      </div>
      <div className="flex-row">
          <div style={{ width: '50%', padding: '2px', paddingBottom: '4px'}}>
              <span><b>N Testes:</b> {props.testsNumber}</span>
          </div>
          <div style={{ width: '50%', padding: '2px', paddingBottom: '4px'}}>
              <span><b>Média de Testes:</b> {props.media}</span>
          </div>
      </div>
      <div style={{ textAlign: 'center', padding: '2px', paddingBottom: '4px'}}>
          <span><b>Nota de módulo/UFCD:</b> {props.moduleGrade}</span>
      </div>
    </div>);
  };

const NestedTable = (props) => {
    const expandedRowRender = (gradeRows) => {
        const columns = [
            { title: 'N de Teste', dataIndex: 'number', key: 'number', width: '10%' },
            { title: 'Data', dataIndex: 'date', key: 'date', width: '80%' },
            { title: 'Nota', dataIndex: 'grade', key: 'grade', width: '10%' },
        ];

        return (
            <Table
                columns={columns}
                dataSource={gradeRows}
                pagination={false}
            />
        );
    };

    const columns = [
        {
            title: 'Disciplina',
            dataIndex: 'discipline',
            key: 'discipline',
            render: (text, row, index) => {
                return <span>{text}</span>
            }
        },
        {
            title: 'Módulo/UFCD',
            dataIndex: 'module',
            key: 'module',
            render: (text, row, index) => {
                return <span>{text}</span>
            }
        },
        {
            title: 'N Testes',
            dataIndex: 'testsNumber',
            key: 'testsNumber',
            render: (text, row, index) => {
                return <span>{text}</span>
            }
        },
        {
            title: 'Média de Testes',
            dataindex: 'media',
            key: 'media',
            render: (text, row, index) => {
                return <span>{text.media !== 0.00  ? '0' : text.media}</span>
            }
        },
        {
            title: 'Nota de módulo/UFCD',
            dataindex: 'moduleGrade',
            key: 'moduleGrade',
            render: (text, row, index) => {
                return <span>{text.moduleGrade}</span>
            }
        }
    ];

    return (
        <Table
            columns={columns}
            expandedRowRender={record => {

                const gradeRows = getGradeRows(props.gradeRows, record.key);

                return expandedRowRender(gradeRows);
            }}
            dataSource={props.rows}
        />
    );
}

function getGradeRows(gradeRows, moduleId) {

    const filteredGradeRows = [];

    for (var i = 0; i < gradeRows.length; i++) {
        if (gradeRows[i].moduleId === moduleId) {
            filteredGradeRows.push(gradeRows[i]);
        }
    }

    return filteredGradeRows;
}

class ChildTests extends React.Component {

    state = {
        selectedDiscipline: -1,
        selectedModule: -1,
        data: [],
        gradeRows: [],
        requestedClassDisciplines: false,
        requestedClassModules: false,
        requestedClassTests: false
    }

    _getSelectedDiscipline = (disciplineId, disciplines) => {

        if (disciplines)
            for (var i = 0; i < disciplines.length; i++) {
                if (disciplines[i].disciplineId === disciplineId) {
                    return disciplines[i];
                }
            }

        return 'NOT FOUND';
    }

    _getModule = (module, modules) => {
        if (modules) {
            for (var i = 0; i < modules.length; i++) {
                if (modules[i].moduleId === module.moduleId) {
                    return modules[i];
                }
            }
        }

        return 'NOT FOUND';
    }

    _getTests = (moduleId, tests) => {
        const foundTests = [];

        if (tests) {
            for (var i = 0; i < tests.length; i++) {
                if (tests[i].moduleId === moduleId) {
                    foundTests.push(tests[i]);
                }
            }
        }

        return foundTests;
    }

    _getTestGrade = (testId, testGrades) => {
        var foundTestGrades;

        if (testGrades) {
            for (var i = 0; i < testGrades.length; i++) {
                if (testGrades[i].testId === testId) {
                    return testGrades[i];
                }
            }
        }

        return foundTestGrades;
    }

    _getModuleGrade = (moduleId, modulesGrades) => {

        if (modulesGrades)
            for (var i = 0; i < modulesGrades.length; i++) {
                if (modulesGrades[i].moduleId === moduleId) {
                    return modulesGrades[i].moduleGrade;
                }
            }

        return 0;
    }

    _requestNeededData = (nextProps, nextState) => {

        if (!testsFetched && nextProps.students) {
            nextProps.requestChildTests(nextProps.students[0].studentId);
            nextProps.requestChildModuleGrades(nextProps.students[0].studentId);
            nextProps.requestChildTestGrades(nextProps.students[0].studentId);
            nextProps.requestChildClass(nextProps.students[0].studentId)
            .then((x) => {
                if(x) {
                    nextProps.requestClassDisciplines(x.classId);
                    nextProps.requestModulesByClass(x.classId);
                    nextProps.requestClassDisciplines(x.classId);
                }
            });

            testsFetched = true;
        }

        if (!nextProps.disciplines && nextProps.studentClass && !nextState.requestedClassDisciplines) {
            nextProps.requestClassDisciplines(nextProps.studentClass.classId);

            nextState.requestedClassDisciplines = true;
        }

        if (!nextProps.modules && nextProps.studentClass && !nextState.requestedClassModules) {
            nextProps.requestModulesByClass(nextProps.studentClass.classId);

            nextState.requestedClassModules = true;
        }

        if (!nextProps.tests && nextProps.studentClass) {
            nextProps.requestClassTests(nextProps.studentClass.classId);

            nextState.requestedClassTests = true;
        }
    }

    componentWillUpdate(nextProps, nextState) {
        this._requestNeededData(nextProps, nextState);

        const data = [];
        const gradeRows = [];

        if (nextProps.moduleGrades && nextProps.testGrades && nextProps.modules && nextProps.tests) {

            var number = 1;

            for (var i = 0; i < nextProps.moduleGrades.length; i++) {

                const foundModule = this._getModule(nextProps.moduleGrades[i], nextProps.modules);

                if (foundModule.moduleId !== nextState.selectedModule && nextState.selectedModule !== -1) {
                    continue;
                }

                const discipline = this._getSelectedDiscipline(foundModule.disciplineId, nextProps.disciplines);

                if (discipline.disciplineId !== nextState.selectedDiscipline && nextState.selectedDiscipline !== -1) {
                    continue;
                }

                const tests = this._getTests(foundModule.moduleId, nextProps.tests);

                const testGrades = [];

                tests.forEach(test => {

                    var grade = this._getTestGrade(test.testId, nextProps.testGrades);

                    if (!grade) {
                        grade = {
                            testGradeId: number,
                            number: number,
                            date: test.date,
                            grade: 0,
                            moduleId: foundModule.moduleId
                        }
                    }

                    testGrades.push(grade);

                    gradeRows.push({
                        key: grade.testGradeId,
                        number: number,
                        date: test.date,
                        grade: grade.grade ? grade.grade : 0,
                        moduleId: foundModule.moduleId
                    });

                    number++;
                });

                var total = 0;

                testGrades.forEach(testGrade => {
                    total += testGrade.grade
                })

                const moduleGrade = this._getModuleGrade(foundModule.moduleId, nextProps.moduleGrades);

                data.push({
                    key: foundModule.moduleId,
                    discipline: discipline.name,
                    module: foundModule.name,
                    testsNumber: tests.length,
                    media: tests.length > 0 ? (total / tests.length).toFixed(2) : 0,
                    moduleGrade: moduleGrade,
                })
            }
        }

        nextState.data = data;
        nextState.gradeRows = gradeRows;
    }

    componentDidMount() {
        this.forceUpdate();
    }

    render() {
        var avaibleDisciplines;
        var avaibleModules;
        delay = 0;

        if (this.props.disciplines) {
            avaibleDisciplines = this.props.disciplines.map((item) => {
                return (
                    <Option key={item.disciplineId} value={item.disciplineId}>
                        {item.abbreviation}
                    </Option>
                );
            });
        }

        if (this.props.modules) {
            avaibleModules = this.props.modules.map((item) => {
                if (item.disciplineId === this.state.selectedDiscipline) {
                    return (
                        <Option key={item.moduleId} value={item.moduleId}>
                            {item.name}
                        </Option>
                    );
                }
            });
        }

        return (
            <div className="students-tests-container">
                <div className="ant-card-bordered students-tests animated slideInUp">
                    <div className="students-tests-options">
                        <div className="select select-margin">
                            <label>Disciplina:</label>
                            <Select value={this.state.selectedDiscipline} onChange={(value) => this.setState({ selectedDiscipline: value, selectedModule: -1 })} placeholder="Disciplina...">
                                {avaibleDisciplines}
                                <Option value={-1}>
                                    Todos
                                </Option>
                            </Select>
                        </div>
                        <div className="select select-margin">
                            <label>Módulo/UFCD:</label>
                            <Select value={this.state.selectedModule} onChange={(value) => this.setState({ selectedModule: value })} placeholder="Modules...">
                                {avaibleModules}
                                <Option value={-1}>
                                    Todos
                                </Option>
                            </Select>
                        </div>
                    </div>
                    {window.innerWidth > 600 ? (
            <div className="test-cotent-container">
              <NestedTable
                rows={this.state.data}
                gradeRows={this.state.gradeRows}
              />
            </div>
          ) : (
            ""
          )}
                </div>
                {window.innerWidth < 600
          ? this.state.data.map(row => {
              delay++;
              return <ModuleGradeCard delay={delay} key={row.key} discipline={row.discipline} media={row.media} module={row.module} moduleGrade={row.moduleGrade} testsNumber={row.testsNumber} />;
          })
          : ""}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        tests: state.tests.tests,
        studentClass: state.classes.studentClass,
        modules: state.modules.modules,
        moduleGrades: state.modules.moduleGrades,
        testGrades: state.grades.testGrades,
        disciplines: state.disciplines.classDisciplines,
        students: state.students.parentStudents
    };
};

const mapDispatchToProps = {
    requestClassDisciplines,
    requestModulesByClass,
    requestClassTests,
    requestChildModuleGrades,
    requestChildTestGrades,
    requestChildTests,
    requestChildClass
};

export default connect(mapStateToProps, mapDispatchToProps)(ChildTests);