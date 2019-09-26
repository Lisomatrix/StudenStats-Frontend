import React from 'react';
import { Button, Checkbox } from 'antd';

export default class MultiFilesOptions extends React.Component {

    render() {
        return(
            <div className="multi-file-options-container animated slideInDown">
                <div className="options-container">
                    <Button shape="circle" icon="download" />
                </div>
                <div className="options-container">
                    <Button shape="circle" icon="info" />
                </div>
                <div className="options-container">
                    <Button type="danger" shape="circle" icon="delete" />
                </div>
                <div className="options-container">
                    <Checkbox checked={this.props.cheked} onChange={this.props.onCheck} style={{ marginTop: '4px' }} />
                </div>
            </div>
        );
    }
}