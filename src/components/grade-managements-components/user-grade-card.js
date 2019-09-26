import React from 'react';
import { Table, Checkbox, Button, Avatar, Modal, Menu, Dropdown, Icon, Select, Card, Input } from 'antd';

export default class UserGradeCard extends React.Component {

    render() {
        return(
            <Card hoverable>
                <div className="user-grade-card">
                    <div className="user-photo-container">
                        <Avatar size={64} src={this.props.photo} />
                    </div>
                    <div className="user-grade-container">
                        <span className="name">{this.props.name}</span><br/>
                        <b className="grade-title">Nota:</b>
                        <span className="grade">{this.props.grade}</span>
                    </div>
                </div>
            </Card>
        );
    }
}