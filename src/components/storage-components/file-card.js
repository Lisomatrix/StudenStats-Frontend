import React from 'react';
import { shallowEqual } from 'shouldcomponentupdate-children';
import { Card, Modal, Icon, Dropdown, Menu } from 'antd';

const confirm = Modal.confirm;

function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

export default class FileCard extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        return shallowEqual(this.props, nextProps, this.state, nextState);
    }

    _confirmDelete = () => {

        confirm({
            title: 'Tem a certeza que pretende eliminar este ficheiro ?',
            content: this.props.fileName,
            okButtonProps: { type: "danger" },
            okText: "Eliminar",
            onOk: () => this.props.delete(this.props.fileId),
            onCancel() {
            },
        });

    }

    menu = (
        <Menu>
            <Menu.Item onClick={() => this.props.download(this.props.fileId, this.props.fileName)} className="context-menu-item" key="1"> <Icon style={{ fontSize: '20px' }} type="download" /> Download</Menu.Item>
            <Menu.Item onClick={() => this.props.showInfo(this.props.fileName, this.props.fileSize)} className="context-menu-item" key="2"> <Icon style={{ fontSize: '20px' }} type="info" /> Informação</Menu.Item>
            <Menu.Item onClick={this._confirmDelete} className="context-menu-item" key="3"> <Icon style={{ fontSize: '20px' }} type="delete" /> Eliminar</Menu.Item>
        </Menu>
    );


    render() {
        return (
            <Dropdown overlay={this.menu} trigger={this.props.isMobile ? ['click'] : ['contextMenu']}>
                <Card hoverable>
                    <div className="file-card-display-container">
                        <div className="file-img-container">
                            <Icon type="file" />
                        </div>
                        <div className="info-container">
                            <span className="name">{this.props.fileName}</span>
                            <span className="size">{formatBytes(this.props.fileSize)}</span>
                        </div>
                    </div>
                </Card>
            </Dropdown>
        );
    }
}