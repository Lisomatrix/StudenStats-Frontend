import React from "react";
import { Table, Checkbox, Menu, Icon, Dropdown } from "antd";

export default class UsersTable extends React.Component {
  columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: "30%"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%"
    },
    {
      title: "Registado",
      dataIndex: "created",
      key: "created",
      render: text => <Checkbox checked={text} />,
      width: "10%"
    },
    {
      title: "Código de Registro",
      dataIndex: "registerCode",
      key: "registerCode",
      width: "15%"
    },
    {
      dataIndex: "actions",
      key: "actions",
      render: (text, row, key) => {
        const menu = (
          <Menu style={{ width: "140px" }}>
            <Menu.Item
              onClick={() => this.props.edit(row.key)}
              className="context-menu-item small-menu-item"
              key="1"
            >
              {" "}
              <Icon style={{ fontSize: "20px" }} type="edit" /> Editar
            </Menu.Item>
            <Menu.Item
              onClick={() => this.props.remove(row.key)}
              className="context-menu-item small-menu-item"
              key="3"
            >
              {" "}
              <Icon style={{ fontSize: "20px" }} type="delete" /> Eliminar
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <a href="javascript:;" className="ant-dropdown-link">
              Opções <Icon type="down" />
            </a>
          </Dropdown>
        );
      },
      width: "10%"
    }
  ];

  mobileColumns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%"
    },
    {
      title: "",
      dataIndex: "extra",
      key: "extra",
      width: "30%",
      render: (text, row, key) => {
        
        const menu = (
          <Menu style={{ width: "140px" }}>
            <Menu.Item
              onClick={() => this.props.edit(row.key)}
              className="context-menu-item small-menu-item"
              key="1"
            >
              {" "}
              <Icon style={{ fontSize: "20px" }} type="edit" /> Editar
            </Menu.Item>
            <Menu.Item
              onClick={() => this.props.remove(row.key)}
              className="context-menu-item small-menu-item"
              key="3"
            >
              {" "}
              <Icon style={{ fontSize: "20px" }} type="delete" /> Eliminar
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <a href="javascript:;" className="ant-dropdown-link">
              Opções <Icon type="down" />
            </a>
          </Dropdown>
        );
      }
    }
    // {
    //     title: 'Código de Registro',
    //     dataIndex: 'registerCode',
    //     key: 'registerCode',
    //     width: '15%'
    // },
    // {
    //     dataIndex: 'actions',
    //     key: 'actions',
    //     render: (text, row, key) => {

    //         const menu = (
    //             <Menu style={{ width: '140px' }}>
    //                 <Menu.Item onClick={() => this.props.edit(row.key)} className="context-menu-item small-menu-item" key="1"> <Icon style={{ fontSize: '20px' }} type="edit" /> Editar</Menu.Item>
    //                 <Menu.Item onClick={() => this.props.remove(row.key)} className="context-menu-item small-menu-item" key="3"> <Icon style={{ fontSize: '20px' }} type="delete" /> Eliminar</Menu.Item>
    //             </Menu>
    //         );

    //         return (
    //             <Dropdown overlay={menu} trigger={['click']}>
    //                 <a href="javascript:;" className="ant-dropdown-link">
    //                     Opções <Icon type="down" />
    //                 </a>
    //             </Dropdown>
    //         );
    //     },
    //     width: '10%'
    // }
  ];

  render() {
    return (
      <div>
        <Table
          columns={window.innerWidth > 600 ? this.columns : this.mobileColumns}
          dataSource={this.props.data}
        />
      </div>
    );
  }
}
