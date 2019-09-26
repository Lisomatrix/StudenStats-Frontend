import React from "react";
import { Table, AutoComplete, Form, Avatar, Button } from "antd";

export default class StudentsList extends React.Component {
  state = {
    data: [],
    selectedStudent: undefined,
    class: undefined
  };

  columns = [
    {
      title: "Foto",
      dataIndex: "face",
      width: "10%",
      key: "face",
      render: (text, row, index) => {
        return <Avatar id={row.key} className="icon" size="user" src={text} />;
      }
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
        return (
          <Button
            onClick={() => {
              if (this.props.removeStudent) {
                this.props.removeStudent(row.key);
              }
            }}
            icon="delete"
            type="danger"
            shape="circle"
          />
        );
      }
    }
  ];

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.class) {
      if (nextProps.class.students) {
        const data = [];

        for (var i = 0; i < nextProps.class.students.length; i++) {
          data.push({
            key: nextProps.class.students[i].studentId,
            face: nextProps.class.students[i].photo,
            name: nextProps.class.students[i].name
          });
        }

        nextState.data = data;
      }
    }
  }

  render() {
    return (
      <div className="students-list-container">
        <Form.Item
          style={{ textAlign: "left" }}
          className="search-student-form-item flex-column"
          label="Procurar Aluno"
        >
          <AutoComplete
            value={this.state.selectedStudent}
            style={{
              width: "100%"
            }}
            filterOption={(inputValue, option) =>
              option.props.children
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
            onSelect={(value, option) => {
              if (this.props.addStudent) {
                this.props.addStudent(option.key);
              }
            }}
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
