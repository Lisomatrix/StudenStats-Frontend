import React from 'react';
import { Upload, Icon, message, Modal } from 'antd';
import { config } from './../../../constants/config';

class Test extends React.Component {
	state = {
		loading: false,
		previewVisible: false,
		previewImage: '',
		fileList: [],
		valid: true,
		sent: false
	};

	beforeUpload = (file) => {
		const isJPG = file.type === 'image/jpeg';
		const isPNG = file.type === 'image/png';

		if (!isJPG && !isPNG) {
			message.error('Só é permitido imagens PNG ou JPG!');
		}

		const isLt2M = file.size / 1024 / 1024 < 2;

		if (!isLt2M) {
			message.error('A imagem não pode ter mais de 2MB!');
		}

		if ((isJPG && isLt2M) || (isPNG && isLt2M)) {
			this.setState({ valid: true });
		} else {
			this.setState({ valid: false });
		}

		return (isJPG || isPNG) && isLt2M;
	};

	handleCancel = () => this.setState({ previewVisible: false });

	handlePreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true
		});
	};

	fileSentWarn = () => {
		message.success('Avatar enviado!');
	};

	discardImage = () => {
		if (!this.state.valid) {
			this.setState({ fileList: [] });
		} else {
			if (!this.state.sent) {
				this.setState({ sent: true }, this.fileSentWarn);
			}
		}
	};

	handleChange = ({ fileList }) => this.setState({ fileList }, this.discardImage);

	render() {
		const { previewVisible, previewImage } = this.state;
		const uploadButton = (
			<div>
				<Icon type={this.state.loading ? 'loading' : 'plus'} />
				<div className="ant-upload-text">Upload</div>
			</div>
		);

		return (
			<div>
				<Upload
					name="file"
					listType="picture-card"
					className="avatar-uploader"
					showUploadList={true}
					action={config.httpServerURL + '/api/5532/avatar'}
					fileList={this.state.fileList}
					beforeUpload={this.beforeUpload}
					listType="picture-card"
					onPreview={this.handlePreview}
					onChange={this.handleChange}
				>
					{this.state.fileList.length === 1 ? null : uploadButton}
				</Upload>
				<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		);
	}
}

export default Test;
