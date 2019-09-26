import React, { Component } from "react";
import moment from "moment";
import {
  Table,
  Checkbox,
  Button,
  Avatar,
  Modal,
  Menu,
  Dropdown,
  Icon,
  Select,
  message,
  Input
} from "antd";
import { connect } from "react-redux";
import {
  sendCreateLesson,
  sendGetLessons,
  sendGetLessonsComplete,
  sendAddLessonComplete,
  sendGetAbsencesByLesson,
  sendGetAbsencesByLessonComplete,
  sendGetStudents,
  sendGetStudentsComplete,
  sendMarkAbsence,
  sendUpdateSummary
} from "./../../../redux/actions/websocket";
import { setUpdateSummary } from "./../../../redux/actions/websocketActions/lesson";
import "./../../../styles/lesson-management.less";
import { shallowEqual } from "shouldcomponentupdate-children";
import { isNull } from "util";
import {
  requestNewLesson,
  requestLessonSummaryUpdate,
  requestClassLessons
} from "./../../../redux/actions/restActions/lesson";
import {
  requestTeacherDisciplines,
  requestClassDisciplines
} from "./../../../redux/actions/restActions/discipline";
import {
  requestLessonAbsences,
  requestMarkAbsence
} from "./../../../redux/actions/restActions/absence";

const Option = Select.Option;
const { TextArea } = Input;

var materialId;
var lateId;
var disciplineId;
var presenceId;

const disciplinarAbsenceData = {
  studentId: undefined,
  checked: undefined
};

function canChangeAbsences(lessonDate) {
  const currentDate = new Date();

  const parts = lessonDate.split("-");

  const date = new Date();

  parts[2] = parts[2].substring(0, 4);

  date.setUTCDate(parts[0]);
  date.setUTCMonth(parts[1] - 1);
  date.setUTCFullYear(parts[2]);

  if (moment(date).isSame(currentDate, "day")) {
    return true;
  } else {
    return false;
  }
}

function getStudentAbsences(studentId, absences, selectedLesson) {
  if (absences) {
    var foundAbsences = [];

    for (var i = 0; i < absences.length; i++) {
      const tempAbsence = absences[i];

      if (
        tempAbsence.studentId === studentId &&
        tempAbsence.lessonId === selectedLesson
      ) {
        foundAbsences.push(tempAbsence);
      }

      if (foundAbsences.length >= 5) {
        break;
      }
    }

    return foundAbsences;
  }
}

function generateRow(studentAbsences, student) {
  var material = false;
  var discipline = false;
  var late = false;
  var presence = false;

  studentAbsences.forEach(absence => {
    switch (absence.absenceType) {
      case "DISCIPLINAR": {
        discipline = true;
        break;
      }

      case "MATERIAL": {
        material = true;
        break;
      }

      case "PRESENCA": {
        presence = true;
        break;
      }

      case "ATRASO": {
        late = true;
        break;
      }

      default:
        break;
    }
  });

  const newRow = {
    key: student.studentId,
    name: student.name,
    face: student.photo ? student.photo : "user",
    material: material,
    presence: presence,
    late: late,
    discipline: discipline
  };

  const options = {
    material: material,
    presence: presence,
    late: late,
    discipline: discipline
  };

  const mobileRow = {
    key: student.studentId,
    name: student.name,
    face: student.photo ? student.photo : "user",
    options: options
  };

  return { newRow, mobileRow };
}

function getRowsV1(selectedClass, absences, selectedLesson) {
  const data = [];
  const mobileData = [];

  for (var i = 0; i < selectedClass.students.length; i++) {
    var studentAbsences = [];

    if (absences) {
      studentAbsences = getStudentAbsences(
        selectedClass.students[i].studentId,
        absences,
        selectedLesson
      );
    }

    const row = generateRow(studentAbsences, selectedClass.students[i]);

    data.push(row.newRow);
    mobileData.push(row.mobileRow);
  }

  return { data, mobileData };
}

function getClass(selectedClass, classes) {
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].classId === selectedClass) {
      return classes[i];
    }
  }
}

class LessonMagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      mobileData: [],
      previewImageURL: "",
      previewVisible: false,
      summaryVisible: false,
      selectedClass: null,
      selectedLesson: null,
      selectedLessonDate: "",
      canChangeAbsences: false,
      selectedDiscipline: null,
      addLessonLoading: false,
      getLessonLoading: false,
      getStudentsLoading: false,
      getAbsencesLoading: false,
      lessonChanged: true,
      absenceExist: false,
      idsSet: false,
      summaryText: "",
      disciplineModalVisible: false,
      disciplineDescriptionText: "",
      newLessonModalVisible: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowEqual(this.props, nextProps, this.state, nextState);
  }

  markDisciplinarAbsenceConfirm = () => {
    if (this.state.disciplineDescriptionText.trim() === "") {
      message.error("É necessário uma descrição!");
    } else {
      this.setState({
        disciplineModalVisible: false,
        disciplineDescriptionText: ""
      });
      this.markAbsence(
        disciplineId,
        disciplinarAbsenceData.studentId,
        true,
        disciplinarAbsenceData.checked,
        this.state.disciplineDescriptionText
      );
    }
  };

  showAbsenceModal = () => {
    this.setState({ disciplineModalVisible: true });
  };

  changeDisciplineDescription = e =>
    this.setState({ disciplineDescriptionText: e.target.value });

  changeSummary = e => this.setState({ summaryText: e.target.value });

  showSummary = () => {
    if (
      this.state.selectedClass &&
      this.state.selectedDiscipline &&
      this.state.selectedLesson &&
      this.props.teacherId
    ) {
      this.setState({ summaryVisible: true });
    } else {
      if (!this.state.selectedClass && !this.state.selectedDiscipline) {
        message.error("Selecione uma turma, disciplina e lição");
      } else if (!this.state.selectedClass) {
        message.error("Selecione uma turma");
      } else if (!this.state.selectedDiscipline) {
        message.error("Selecione uma disciplina");
      } else if (!this.state.selectedLesson) {
        message.error("Selecione uma lição");
      }
    }
  };

  getStudentRow(rowKey) {
    var mobileRow;
    var row;

    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].key === rowKey) {
        row = this.state.data[i];
      }

      if (this.state.mobileData[i].key === rowKey) {
        mobileRow = this.state.mobileData[i];
      }
    }

    return { row, mobileRow };
  }

  previewImage = e => {
    const row = e.target.parentElement.id;

    const image = this.state.data.find(function(element) {
      if (element.key === row) {
        return element;
      }
    });

    this.setState({ previewImageURL: image.face, previewVisible: true });
  };

  cancelPreviewImage = e => {
    if (this.state.summaryVisible) {
      this.props.lessons.find(lesson => {
        if (
          lesson.lessonId === this.state.selectedLesson &&
          this.state.summaryText !== lesson.summary
        ) {
          const updateSummary = {
            lessonId: this.state.selectedLesson,
            summary: this.state.summaryText
          };

          lesson.summary = this.state.summaryText;

          this.props.requestLessonSummaryUpdate(updateSummary);
          // this.props.setUpdateSummary(lesson);
          message.success("Sumário atualizado!");
        }
      });
    }

    this.setState({ previewVisible: false, summaryVisible: false });
  };

  triggerMissing = e => {
    if (isNull(this.state.selectedDiscipline)) {
      message.error("Selecione uma disciplina");
      return;
    } else if (isNull(this.state.selectedLesson)) {
      message.error("Selecione uma lição");
      return;
    }

    const rows = this.getStudentRow(parseInt(e.target.id));

    if (rows.row.presence === true && !this.state.canChangeAbsences) {
      message.error("Só pode remover faltas no proprio dia!");
    } else {
      rows.row.presence = e.target.checked;

      rows.mobileRow.options.presence = e.target.checked;

      const newData = this.state.data;

      const newMobileData = this.state.mobileData;

      newData[e.target.id - 1] = rows.row;

      newMobileData[e.target.id - 1] = rows.mobileRow;

      this.markAbsence(
        presenceId,
        e.target.id,
        true,
        e.target.checked,
        e.target.id
      );

      this.setState({ data: newData, mobileData: newMobileData });
    }
  };

  triggerMaterial = e => {
    if (isNull(this.state.selectedDiscipline)) {
      message.error("Selecione uma disciplina");
      return;
    } else if (isNull(this.state.selectedLesson)) {
      message.error("Selecione uma lição");
      return;
    }

    const rows = this.getStudentRow(parseInt(e.target.id));

    if (rows.row.material === true && !this.state.canChangeAbsences) {
      message.error("Só pode remover faltas no proprio dia!");
    } else {
      rows.row.material = e.target.checked;

      rows.mobileRow.options.material = e.target.checked;

      const newData = this.state.data;

      const newMobileData = this.state.mobileData;

      newData[e.target.id - 1] = rows.row;

      newMobileData[e.target.id - 1] = rows.mobileRow;

      this.markAbsence(materialId, e.target.id, false, e.target.checked);

      this.setState({ data: newData, mobileData: newMobileData });
    }
  };

  triggerLate = e => {
    if (isNull(this.state.selectedDiscipline)) {
      message.error("Selecione uma disciplina");
      return;
    } else if (isNull(this.state.selectedLesson)) {
      message.error("Selecione uma lição");
      return;
    }

    const rows = this.getStudentRow(parseInt(e.target.id));

    if (rows.row.late === true && !this.state.canChangeAbsences) {
      message.error("Só pode remover faltas no proprio dia!");
    } else {
      rows.row.late = e.target.checked;

      rows.mobileRow.options.late = e.target.checked;

      const newData = this.state.data;

      const newMobileData = this.state.mobileData;

      newData[e.target.id - 1] = rows.row;

      newMobileData[e.target.id - 1] = rows.mobileRow;

      this.markAbsence(lateId, e.target.id, true, e.target.checked);

      this.setState({ data: newData, mobileData: newMobileData });
    }
  };

  triggerDiscipline = e => {
    if (isNull(this.state.selectedDiscipline)) {
      message.error("Selecione uma disciplina");
      return;
    } else if (isNull(this.state.selectedLesson)) {
      message.error("Selecione uma lição");
      return;
    }

    const rows = this.getStudentRow(parseInt(e.target.id));

    if (rows.row.discipline) {
      message.error("Não pode remover faltas disciplinares!");
    } else {
      rows.row.discipline = e.target.checked;

      rows.mobileRow.options.discipline = e.target.checked;

      const newData = this.state.data;

      const newMobileData = this.state.mobileData;

      newData[e.target.id - 1] = rows.row;

      newMobileData[e.target.id - 1] = rows.mobileRow;

      if (e.target.checked) {
        this.showAbsenceModal();
        disciplinarAbsenceData.studentId = e.target.id;
        disciplinarAbsenceData.checked = e.target.checked;
      } else {
        this.markAbsence(disciplineId, e.target.id, true, e.target.checked);
      }

      this.setState({ data: newData, mobileData: newMobileData });
    }
  };

  markAbsence = (
    absenceTypeId,
    studentId,
    justificable,
    create,
    description = "",
    absenceId
  ) => {
    const absence = {
      studentId: studentId,
      disciplineId: this.state.selectedDiscipline,
      lessonId: this.state.selectedLesson,
      justificable: justificable,
      absenceType: absenceTypeId,
      create: create,
      description: description,
      absenceId: absenceId
    };

    this.props.requestMarkAbsence(absence);
  };

  handleLessonChange = value => {
    this.setState({ selectedLesson: value }, () => {
      this.props.lessons.find(lesson => {
        if (lesson.lessonId === this.state.selectedLesson) {
          const canChangeLesson = canChangeAbsences(lesson.date);

          this.setState({
            summaryText: lesson.summary,
            selectedLessonDate: lesson.date
              .slice(0, 10)
              .replace("-", "/")
              .replace("-", "/"),
            canChangeAbsences: canChangeLesson
          });
        }
      });

      if (this.props.absences) {
        var found = false;

        for (var i = 0; i < this.props.absences.length; i++) {
          const tempAbsence = this.props.absences[i];

          if (tempAbsence.lessonId === this.state.selectedLesson) {
            found = true;
            break;
          }
        }

        if (!found) {
          this.getAbsences();
        } else {
          this.props.sendGetAbsencesByLessonComplete();
          this.setState(
            {
              getAbsencesLoading: true,
              lessonChanged: true,
              absenceExist: true
            },
            () => {}
          );
        }
      } else {
        this.getAbsences();
      }
    });
  };

  handleClassChange = value => {
    this.setState(
      { selectedClass: value, selectedDiscipline: null, selectedLesson: null },
      () => {
        this.setState({ getStudentsLoading: false });
        this.props.sendGetStudentsComplete();
      }
    );
  };

  handleDisciplineChange = value => {
    this.setState({ selectedDiscipline: value, selectedLesson: null }, () => {
      if (this.props.lessons) {
        var found = false;

        for (var i = 0; i < this.props.lessons.length; i++) {
          const tempLesson = this.props.lessons[i];

          if (
            tempLesson.disciplineId === this.state.selectedDiscipline &&
            tempLesson.classId === this.state.selectedClass
          ) {
            found = true;
            break;
          }
        }

        if (!found) {
          this.getLessons();
        } else {
          this.setState({ getLessonLoading: false, lessonChanged: true });
          this.props.sendGetLessonsComplete();
        }
      } else {
        this.getLessons();
      }
    });
  };

  createNewLesson = () => {
    if (
      this.state.selectedClass &&
      this.state.selectedDiscipline &&
      this.props.teacherId
    ) {
      this.setState({ addLessonLoading: true }, () => {
        const newLesson = {
          disciplineId: this.state.selectedDiscipline,
          classId: this.state.selectedClass,
          teacherId: this.props.teacherId
        };

        this.props.requestNewLesson(newLesson).then(Response => {
          if (Response.status) {
            this.setState({ addLessonLoading: false }, () => {
              message.error(
                "Não é possível criar mais lições para esta disciplina!"
              );
            });
          }
        });
      });
    } else {
      if (!this.state.selectedClass && !this.state.selectedDiscipline) {
        message.error("Selecione uma turma e disciplina");
      } else if (!this.state.selectedClass) {
        message.error("Selecione uma turma");
      } else if (!this.state.selectedDiscipline) {
        message.error("Selecione uma disciplina");
      }
    }
  };

  getLessons = () => {
    this.setState({ getLessonLoading: true, lessonChanged: true }, () => {
      this.props.requestClassLessons(
        this.state.selectedClass,
        this.state.selectedDiscipline
      );
    });
  };

  getStudents = () => {
    this.setState({ getStudentsLoading: true }, () => {
      const getStudents = {
        classId: this.state.selectedClass
      };

      this.props.sendGetStudents(getStudents);
    });
  };

  getAbsences = () => {
    this.props.requestLessonAbsences(this.state.selectedLesson);
    this.setState({ getAbsencesLoading: true, lessonChanged: true }, () => {});
  };

  componentWillUpdate(nextProps, nextState) {
    if (!nextProps.teacherDisciplines) {
      this.props.requestTeacherDisciplines();
    }

    if (nextProps.classes) {
      const selectedClass = getClass(
        nextState.selectedClass,
        nextProps.classes
      );

      if (selectedClass) {
        const rows = getRowsV1(
          selectedClass,
          nextProps.absences,
          nextState.selectedLesson
        );

        nextState.lessonChanged = false;
        nextState.getAbsencesLoading = false;
        nextState.data = rows.data;
        nextState.mobileData = rows.mobileData;
        nextState.absenceExist = false;

        this.props.sendGetAbsencesByLessonComplete();
      }
    }

    if (!this.state.idsSet && nextProps.absenceTypes) {
      for (var i = 0; i < nextProps.absenceTypes.length; i++) {
        if (nextProps.absenceTypes[i].name === "DISCIPLINAR") {
          disciplineId = nextProps.absenceTypes[i].absenceTypeId;
        }

        if (nextProps.absenceTypes[i].name === "MATERIAL") {
          materialId = nextProps.absenceTypes[i].absenceTypeId;
        }

        if (nextProps.absenceTypes[i].name === "PRESENCA") {
          presenceId = nextProps.absenceTypes[i].absenceTypeId;
        }

        if (nextProps.absenceTypes[i].name === "ATRASO") {
          lateId = nextProps.absenceTypes[i].absenceTypeId;
        }
      }

      nextState.idsSet = true;
    }

    if (this.state.addLessonLoading) {
      if (nextProps.addSuccess === true) {
        var lastestLesson = 0;
        var lastestLessonId = 0;

        for (var i = 0; i < this.props.lessons.length; i++) {
          var tempLesson = this.props.lessons[i];

          if (
            tempLesson.disciplineId === this.state.selectedDiscipline &&
            tempLesson.classId === this.state.selectedClass &&
            tempLesson.lessonNumber > lastestLesson
          ) {
            lastestLesson = tempLesson.lessonNumber;
            lastestLessonId = tempLesson.lessonId;
          }
        }

        const currentDate = new Date();

        const dateString =
          currentDate.getDate() +
          "/" +
          (currentDate.getMonth() + 1) +
          "/" +
          currentDate.getFullYear();

        nextState.addLessonLoading = false;
        nextState.selectedLesson = lastestLessonId;
        nextState.selectedLessonDate = dateString;
        this.props.sendAddLessonComplete();
        this.handleLessonChange(lastestLessonId);
        message.success("Nova lição criada!");
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.getLessonLoading) {
      if (nextProps.getSuccess === true) {
        this.setState({ getLessonLoading: false }, () => {
          this.props.sendGetLessonsComplete();
        });
      }
    }

    if (this.state.getStudentsLoading) {
      if (nextProps.getStudents === true) {
        this.setState({ getStudentsLoading: false }, () => {
          this.props.sendGetStudentsComplete();
        });
      }
    }

    if (this.state.lessonChanged) {
      if (nextProps.getAbsences === true) {
        this.setState(
          { getAbsencesLoading: false, lessonChanged: false },
          () => {
            this.props.sendGetAbsencesByLessonComplete();
          }
        );
      }
    }
  }

  render() {
    const mobileColumns = [
      {
        title: "Foto",
        dataIndex: "face",
        key: "face",
        width: "20%",
        render: (text, row, index) => {
          const isPhoto = text !== "user";

          return (
            <button className="reset-btn" id={row.key}>
              {isPhoto ? (
                <Avatar id={row.key} className="icon" size="user" src={text} />
              ) : (
                <Avatar id={row.key} className="icon" size="user" icon="user" />
              )}
            </button>
          );
        }
      },
      ,
      {
        title: "Nome",
        dataIndex: "name",
        key: "name",
        width: "35%",
        render: text => <a href="javascript:;">{text}</a>
      },
      {
        title: "Opções",
        dataIndex: "options",
        key: "options",
        width: "45%",
        render: (text, row, index) => {
          var material = false;
          var presence = false;
          var late = false;
          var discipline = false;

          if (text) {
            material = text.material;
            presence = text.presence;
            late = text.late;
            discipline = text.discipline;
          }

          const menu = (
            <Menu>
              <Menu.Item key="0">
                <Checkbox
                  checked={material}
                  onChange={this.triggerMaterial}
                  id={row.key}
                >
                  Falta de Material
                </Checkbox>
              </Menu.Item>
              <Menu.Item key="1">
                <Checkbox
                  checked={presence}
                  onChange={this.triggerMissing}
                  id={row.key}
                >
                  Falta de Presenca
                </Checkbox>
              </Menu.Item>
              <Menu.Item key="3">
                <Checkbox
                  checked={late}
                  onChange={this.triggerLate}
                  id={row.key}
                >
                  Falta de Atraso
                </Checkbox>
              </Menu.Item>
              <Menu.Item key="4">
                <Checkbox
                  checked={discipline}
                  onChange={this.triggerDiscipline}
                  id={row.key}
                >
                  Falta Disciplinar
                </Checkbox>
              </Menu.Item>
            </Menu>
          );

          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <a className="ant-dropdown-link" href="#">
                Opções <Icon type="down" />
              </a>
            </Dropdown>
          );
        }
      }
    ];

    const columns = [
      {
        title: "Foto",
        dataIndex: "face",
        key: "face",
        width: "15%",
        render: (text, row, index) => {
          const isPhoto = text !== "user";

          return (
            <button className="reset-btn" id={row.key}>
              {isPhoto ? (
                <Avatar id={row.key} className="icon" size="user" src={text} />
              ) : (
                <Avatar id={row.key} className="icon" size="user" icon="user" />
              )}
            </button>
          );
        }
      },
      {
        title: "Nome",
        dataIndex: "name",
        key: "name",
        width: "20%",
        render: text => <a href="javascript:;">{text}</a>
      },
      {
        title: "Falta de Material",
        dataIndex: "material",
        key: "material",
        width: "15%",
        render: (text, row, index) => {
          return (
            <Checkbox
              className={row.key}
              id={row.key.toString()}
              onChange={this.triggerMaterial}
              checked={text}
            />
          );
        }
      },
      {
        title: "Falta de Presença",
        dataIndex: "presence",
        key: "presence",
        width: "15%",
        render: (text, row, index) => {
          return (
            <Checkbox
              className={row.key}
              id={row.key.toString()}
              onChange={this.triggerMissing}
              checked={text}
            />
          );
        }
      },
      {
        title: "Falta de Atraso",
        dataIndex: "late",
        key: "late",
        width: "15%",
        render: (text, row, index) => {
          return (
            <Checkbox
              className={row.key}
              id={row.key.toString()}
              onChange={this.triggerLate}
              checked={text}
            />
          );
        }
      },
      {
        title: "Falta Disciplinar",
        dataIndex: "discipline",
        key: "discipline",
        width: "20%",
        render: (text, row, index) => {
          return (
            <Checkbox
              className={row.key}
              id={row.key.toString()}
              onChange={this.triggerDiscipline}
              checked={text}
            />
          );
        }
      }
    ];

    var avaibleClasses;
    var avaibleDisciplines;
    var avaibleLessons;

    if (this.props.classes) {
      avaibleClasses = this.props.classes.map(item => {
        return (
          <Option key={item.classId} value={item.classId}>
            {item.name}
          </Option>
        );
      });
    }

    if (this.props.teacherDisciplines) {
      avaibleDisciplines = this.props.teacherDisciplines.map(item => {
        return (
          <Option key={item.disciplineId} value={item.disciplineId}>
            {item.abbreviation}
          </Option>
        );
      });
    }

    if (this.props.lessons) {
      avaibleLessons = this.props.lessons.map(item => {
        if (
          item.disciplineId === this.state.selectedDiscipline &&
          item.classId === this.state.selectedClass
        ) {
          return (
            <Option key={item.lessonId} value={item.lessonId}>
              {item.lessonNumber}
            </Option>
          );
        }
      });
    }

    return (
      <div className="lesson-management-container animated slideInUp">
        <div className="lesson-pickers-container">
          {window.innerWidth > 500 ? (
            <label style={{ gridRow: "1", gridColumn: "1" }}>Turma:</label>
          ) : (
            ""
          )}
          <Select
            className="class-select"
            style={{ width: 120 }}
            placeholder="Turma"
            onChange={this.handleClassChange}
          >
            {avaibleClasses}
          </Select>
          {window.innerWidth > 500 ? (
            <label style={{ gridRow: "1", gridColumn: "2" }}>Disciplina:</label>
          ) : (
            ""
          )}
          <Select
            value={
              this.state.selectedDiscipline
                ? this.state.selectedDiscipline
                : undefined
            }
            disabled={this.state.selectedClass ? false : true}
            className="discipline-select"
            style={{ width: 120 }}
            placeholder={
              this.state.getStudentsLoading ? (
                <Icon type="loading" theme="outlined" />
              ) : (
                "Disciplina"
              )
            }
            onChange={this.handleDisciplineChange}
          >
            {avaibleDisciplines}
          </Select>
          {window.innerWidth > 500 ? (
            <label style={{ gridRow: "1", gridColumn: "3" }}>Lição:</label>
          ) : (
            ""
          )}
          <Select
            value={
              this.state.selectedLesson ? this.state.selectedLesson : undefined
            }
            disabled={this.state.selectedDiscipline ? false : true}
            className="lesson-select"
            style={{ width: 120 }}
            placeholder={
              this.state.getLessonLoading ? (
                <Icon type="loading" theme="outlined" />
              ) : (
                "N.º Lição"
              )
            }
            onChange={this.handleLessonChange}
          >
            {avaibleLessons}
          </Select>
          <span className="lesson-date">{this.state.selectedLessonDate}</span>
          <Button
            loading={this.state.addLessonLoading}
            onClick={this.createNewLesson}
            className="add-lesson-btn"
            type="primary"
          >
            Nova Lição
          </Button>
          <Button
            className="summary-btn"
            onClick={this.showSummary}
            type="primary"
          >
            Sumário
          </Button>
        </div>
        <Table
          rowClassName="animated slideInRight"
          loading={this.state.getLessonLoading || this.state.getAbsencesLoading}
          style={{
            marginLeft: "5px",
            marginRight: "5px"
          }}
          columns={window.innerWidth > 600 ? columns : mobileColumns}
          dataSource={
            window.innerWidth > 600 ? this.state.data : this.state.mobileData
          }
        />
        <Modal
          visible={this.state.previewVisible || this.state.summaryVisible}
          footer={null}
          onCancel={this.cancelPreviewImage}
        >
          {this.state.previewVisible ? (
            <img
              style={{ width: "100%", padding: "15px" }}
              src={this.state.previewImageURL}
            />
          ) : (
            ""
          )}
          {this.state.summaryVisible ? (
            <div className="sumary-container">
              <h3 className="summary-title">Sumário:</h3>
              <TextArea
                value={this.state.summaryText}
                onChange={this.changeSummary}
                rows={8}
              />
            </div>
          ) : (
            ""
          )}
        </Modal>
        <Modal
          visible={this.state.disciplineModalVisible}
          onCancel={() => this.setState({ disciplineModalVisible: false })}
          footer={[
            <Button
              key="back"
              onClick={() => this.setState({ disciplineModalVisible: false })}
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="danger"
              onClick={this.markDisciplinarAbsenceConfirm}
            >
              Marcar
            </Button>
          ]}
        >
          <div style={{ marginTop: "20px" }}>
            <h3 className="summary-title">Descrição:</h3>
            <TextArea
              value={this.state.disciplineDescriptionText}
              onChange={this.changeDisciplineDescription}
              rows={8}
            />
          </div>
        </Modal>
        <Modal
          visible={this.state.newLessonModalVisible}
          onCancel={() => this.setState({ newLessonModalVisible: false })}
          footer={[
            <Button
              key="back"
              onClick={() =>
                this.setState({
                  newLessonModalVisible: false,
                  addLessonLoading: false
                })
              }
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.markDisciplinarAbsenceConfirm}
            >
              Criar Lição
            </Button>
          ]}
        >
          <div style={{ marginTop: "20px" }}>
            <h3>Turma: {this.state.selectedClass}</h3>
            <h3>Nº Licao: {this.state.selectedLesson}</h3>
            <h3>Disciplina: {this.state.selectedDiscipline}</h3>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  sendGetLessons,
  sendCreateLesson,
  sendGetLessonsComplete,
  sendAddLessonComplete,
  sendGetAbsencesByLesson,
  sendGetStudentsComplete,
  sendGetStudents,
  sendGetAbsencesByLessonComplete,
  sendMarkAbsence,
  sendUpdateSummary,
  setUpdateSummary,
  requestNewLesson,
  requestLessonSummaryUpdate,
  requestClassLessons,
  requestTeacherDisciplines,
  requestLessonAbsences,
  requestMarkAbsence
};

const mapStateToProps = state => {
  return {
    classes: state.classes.classes,
    teacherId: state.authentication.userRoleId,
    teacherDisciplines: state.disciplines.teacherDisciplines,
    lessons: state.lessons.lessons,
    getSuccess: state.lessons.getSuccess,
    addSuccess: state.lessons.addSuccess,
    absences: state.absences.absences,
    getStudents: state.students.getStudents,
    students: state.students.students,
    getAbsences: state.absences.getAbsences,
    absenceTypes: state.absences.absenceTypes
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LessonMagement);
