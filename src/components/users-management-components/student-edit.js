import React from "react";
import { Form, Select, AutoComplete } from "antd";

export default class StudentEdit extends React.Component {

  state = {
    selectedClass: null,
    selectedParent: null
  };

  componentWillUpdate(nextProps, nextState) {
    const { student, classes, studentParent, parents } = nextProps;

    if (!nextState.selectedClass && student && classes) {
      for (var i = 0; i < classes.length; i++) {
        if (parseInt(classes[i].key) === student.classId) {
          nextState.selectedClass = classes[i].props.value;
          break;
        }
      }
    }

    if(!nextState.selectedParent && studentParent && parents) {
      for(var i = 0; i < parents.length; i++) {
        if(studentParent.userId === parseInt(parents[i].key)) {
          nextState.selectedParent = parents[i].props.value;
        }
      }
    }
  }

  render() { 
    return (
      <div className="flex-row">
        <Form.Item
          className="classes-select-container flex-column"
          label="Turma"
        >
          <AutoComplete
            placeholder="Turma..."
            className="classes-select"
            value={this.state.selectedClass}
            onSelect={(value, option) => {
              if (this.props.addClass) {
                this.props.addClass(option.key);
                this.setState({ selectedClass: option.key });
              }
            }}
            filterOption={(inputValue, option) =>
              option.props.children
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
          >
            {this.props.classes}
          </AutoComplete>
        </Form.Item>
        <Form.Item
          className="responsable-select-container flex-column"
          label="Encarregado de Educacao"
        >
          <AutoComplete
            className="responsable-select"
            placeholder="Encarregado de Educacao..."
            value={this.state.selectedParent}
            onSelect={(value, option) => {
              if (this.props.changeParent) {
                this.props.changeParent(this.props.userId, option.key);
                this.setState({ selectedParent: option.value });
              }
            }}
            filterOption={(inputValue, option) =>
              option.props.children
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
          >
            {this.props.parents}
          </AutoComplete>
        </Form.Item>
      </div>
    );
  }
}
