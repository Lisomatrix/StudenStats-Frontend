import React from "react";
import { Form, Table, Button, AutoComplete } from "antd";

export default class TeacherEdit extends React.Component {
  state = {
    data: [],
    dataChanged: true,
    selectedDiscipline: undefined
  };

  columns = [
    {
      title: "Disciplina",
      dataIndex: "discipline",
      width: "80%",
      key: "discipline",
      render: (text, row, index) => <a href="javascript:;">{text}</a>
    },
    {
      title: "",
      dataIndex: "action",
      width: "10%",
      key: "action",
      render: (text, row, index) => {
        return (
          <Button
            onClick={() => {this.props.removeDiscipline(this.props.userId, row.key)}}
            icon="delete"
            type="danger"
            shape="circle"
          />
        );
      }
    }
  ];

  componentWillUpdate(nextProps, nextState) {

        const { teacherDisciplines } = nextProps;
        console.log(teacherDisciplines);

        if(nextState.dataChanged && teacherDisciplines) {
            const data = [];

            for(var i = 0; i < teacherDisciplines.length; i++) {
                data.push({
                    key: teacherDisciplines[i].disciplineId,
                    discipline: teacherDisciplines[i].name
                })
            }

            nextState.data = data;
        }
  }

  render() {
    const { disciplines } = this.props;

    var disciplinesOptions = [];

    if (disciplines) {
      disciplinesOptions = disciplines.map(discipline => (
        <AutoComplete.Option
          key={discipline.disciplineId}
          value={discipline.name}
        >
          {discipline.name}
        </AutoComplete.Option>
      ));
    }

    return (
      <div className="teacher-disciplines-container flex-column">
        <Form.Item
          style={{ width: "100%" }}
          className="teacher-disciplines-container"
          label="Disciplinas:"
        >
          <AutoComplete
            value={this.state.selectedDiscipline}
            style={{ width: "100%" }}
            placeholder="Disciplina..."
            filterOption={(inputValue, option) =>
              option.props.children
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
            onSelect={(value, option) => {
              if (this.props.newDiscipline) {
                this.props.newDiscipline(this.props.userId, option.key);
                // this.setState({ })
              }
            }}
          >
            {disciplinesOptions}
          </AutoComplete>
        </Form.Item>
        <Table dataSource={this.state.data} columns={this.columns} />
      </div>
    );
  }
}
