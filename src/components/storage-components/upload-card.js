import React from 'react';
import { Progress } from 'antd';

export default class UploadCard extends React.Component {

    render() {
        return(
            <div className="file-upload-card">
                <div className="file-upload-card-title-container">
                    <h3>{this.props.fileName}</h3>
                </div>
                <div className="file-upload-progress-container">
                    <Progress percent={this.props.percent}  />
                </div>
            </div>
        );
    }
}