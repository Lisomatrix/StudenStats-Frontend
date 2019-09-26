import React from "react";
import { Form, Table, Avatar, AutoComplete, Button } from "antd";

export default class ParentEdit extends React.Component {
  state = {
    data: [],
    selectedStudent: undefined
  };

  columns = [
    {
      title: "Foto",
      dataIndex: "face",
      width: "10%",
      key: "face",
      render: (text, row, index) => (
        <Avatar id={row.key} className="icon" size="user" src={text} />
      )
    },
    {
      title: "Nome",
      dataIndex: "name",
      width: "80%",
      key: "name",
      render: (text, row, index) => <a href="javascript:;">{text}</a>
    },
    {
      title: "",
      dataIndex: "action",
      width: "10%",
      key: "action",
      render: (text, row, index) => {
        return <Button onClick={() => this._removeStudent(row.key)} icon="delete" type="danger" shape="circle" />
      }
    }
  ];

  _removeStudent = (studentId) => {
    if(this.props.parentStudents && this.props.removeChild) {
      for(var i = 0; i < this.props.parentStudents.length; i++) {
        if(this.props.parentStudents[i].studentId === studentId) {
          this.props.removeChild(this.props.parentStudents[i]);
          break;
        }
      }
    }
  }

  _onStudentSelect = (value, option) => {
    this.props.addChild(option.key);
    this.setState({ selectedStudent: undefined });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.parentStudents) {
      const data = [];

      for (var i = 0; i < nextProps.parentStudents.length; i++) {
        data.push({
          face: nextProps.parentStudents[i].photo
            ? nextProps.parentStudents[i].photo
            : "",
          name: nextProps.parentStudents[i].name,
          key: nextProps.parentStudents[i].studentId
        });
      }

      this.setState({ data: data });
    }

    this.forceUpdate();
  }

  render() {
    return (
      <div className="parent-children-container">
        <Form.Item
          className="search-student-form-item flex-column"
          label="Procurar Aluno"
        >
          <AutoComplete
            value={this.state.selectedStudent}
            style={{
              width: "100%"
            }}
            onSelect={this._onStudentSelect}
            filterOption={(inputValue, option) =>
              option.props.children
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
            placeholder="Nome do aluno..."
          >
            {this.props.students}
          </AutoComplete>
        </Form.Item>
        <Table columns={this.columns} dataSource={this.state.data} />
      </div>
    );
  }
}
