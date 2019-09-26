import React from 'react';
import { connect } from 'react-redux';
import { shallowEqual } from 'shouldcomponentupdate-children';
import './../../../styles/storage.less';
import { ChartCard, MiniProgress } from 'ant-design-pro/lib/Charts';
import { List, Upload, Icon, message, Modal, Empty } from 'antd';
import FileCard from './../../../components/storage-components/file-card';
import UploadCard from './../../../components/storage-components/upload-card';
import { config } from './../../../constants/config';
import QueueAnim from 'rc-queue-anim';
import { requestFileDownload, requestUserFiles, requestFileDelete, requestAddFile } from './../../../redux/actions/restActions/storage';

const Dragger = Upload.Dragger;

const SPACE_PER_USER = 5368709120;

var counter = 0;

function containsFiles(event) {
    if (event.dataTransfer.types) {
        for (var i = 0; i < event.dataTransfer.types.length; i++) {
            if (event.dataTransfer.types[i] == "Files") {
                return true;
            }
        }
    }

    return false;
}

function updateProgress(uploadingFiles, info) {

    uploadingFiles.forEach(uploadingFile => {
        if (uploadingFile.uid === info.file.uid) {

            uploadingFile.percent = info.event.percent;
        }
    });

    return uploadingFiles;
}

function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

class Storage extends React.Component {

    state = {
        selectedFiles: [],
        isAllSelected: false,
        isDropping: false,
        uploadingFiles: []
    }

    componentWillMount() {
        this.props.requestUserFiles(this.props.userId);
    }

    componentDidMount() {
        this.props.requestUserFiles(this.props.userId);

    }

    _uploadingInfoChange = (info) => {

        if (info.event) {

            const updated = updateProgress(this.state.uploadingFiles, info);

            this.setState({
                uploadingFiles: updated
            });
        }

        const status = info.file.status;
        if (status !== 'uploading') {

        }
        if (status === 'done') {

            message.success(`Ficheiro ${info.file.name} enviado com sucesso.`);

            this.props.requestAddFile(info.file.response);
            setTimeout(() => this._removeCompletedUploads(info.file.uid), 1500);

        } else if (status === 'error') {
            message.error(`Falha no envio do ficheiro ${info.file.name}.`);

            this._removeCompletedUploads(info.file.uid)
        }
    }

    _removeCompletedUploads = (uid) => {

        const newUploadingFiles = [];

        for (var i = 0; i < this.state.uploadingFiles.length; i++) {
            if (this.state.uploadingFiles[i].uid !== uid) {
                newUploadingFiles.push(this.state.uploadingFiles[i]);
            }
        }

        this.setState({ uploadingFiles: newUploadingFiles });
    }

    _beforeUploading = (file) => {
        const isLt3M = file.size / 1024 / 1024 < 6;

        if (!isLt3M) {
            message.error('O ficheiro não pode ter mais de 3MB!');
        }

        const uploading = this.state.uploadingFiles;

        if (isLt3M) {
            uploading.push({
                fileName: file.name,
                uid: file.uid,
                percent: 0
            });

            this.setState({
                uploadingFiles: uploading
            });
        }

        return isLt3M;
    }

    _getFileInfo = (fileName, fileSize) => {
        Modal.info({
            title: fileName,
            content: <div>
                <b>Nome:</b><span> {fileName}</span>
                <br />
                <b>Tamanho:</b><span> {fileSize} B</span>
            </div>,

        });
    }

    _deleteFile = (fileId) => {
        this.props.requestFileDelete(fileId)
        .then((Response) => {
            if(Response === 500) {
                message.error('Ocorreu um erro ao eliminar o ficheiro!');
            }
        });
    }

    _downloadFile = (fileId, fileName) => {
        this.props.requestFileDownload(fileId, fileName)
        .then((success) => {
            if(!success) {
                message.error('Um erro ocorreu ao fazer download do ficheiro!');
            }
        });
    }

    _showFileUploadZone = (e) => {

        counter++;

        if (containsFiles(e)) {

            if (!this.state.isDropping)
                this.setState({ isDropping: true });
        } else {
            this.setState({ isDropping: false });
        }

        e.preventDefault();
        e.stopPropagation();
    }

    _hideFileUploadZone = (e) => {

        counter--;

        if (counter === 0) {
            if (this.state.isDropping)
                this.setState({ isDropping: false });
        }

        e.preventDefault();
        e.stopPropagation();

        if (counter === 2)
            counter = 1;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowEqual(this.props, nextProps, this.state, nextState);
    }

    componentWillMount() {

        document.addEventListener('dragenter', this._showFileUploadZone);
        document.addEventListener('dragleave', this._hideFileUploadZone);
        document.ondrop = () => {
            setTimeout(() => {
                counter = 0;
                this.setState({ isDropping: false });
            }, 1500);
        }
    }

    componentWillUnmount() {
        document.removeEventListener("dragenter", this._showFileUploadZone);
        document.removeEventListener("dragleave", this._hideFileUploadZone);
        document.ondrop = null;
    }

    render() {

        const uploadingCard = this.state.uploadingFiles.map((uploadingFile) => {
            return (<UploadCard key={uploadingFile.uid} fileName={uploadingFile.fileName} percent={uploadingFile.percent} />);
        });

        var usedSpace = 0;

        if (this.props.files) {
            for (var i = 0; i < this.props.files.length; i++) {
                usedSpace += this.props.files[i].fileSize;
            }
        }

        const freeSpace = SPACE_PER_USER - usedSpace;

        const usedSpaceDisplay = formatBytes(usedSpace);
        const freeSpaceDsplay = formatBytes(freeSpace);

        const percent = usedSpace * 100 / SPACE_PER_USER;

        return (
            <div>
                <QueueAnim delay={200} className="queue-simple">
                    {uploadingCard}
                </QueueAnim>
                <div className="storage-container animated slideInDown">
                    <div className="storage-capacity-container">
                        <ChartCard
                            title="Espaço Disponível"
                            style={{ textAlign: 'left', fontSize: '18px' }}
                            footer={
                                <div style={{ fontSize: '16px', marginTop: '18px' }}>
                                    <span>
                                        Usado: {usedSpaceDisplay}
                                    </span>
                                    <span style={{ float: 'right' }}>
                                        Livre: {freeSpaceDsplay}
                                    </span>
                                </div>
                            }
                        >
                            <MiniProgress color={this.props.primaryColor} percent={percent} strokeWidth={8} />
                        </ChartCard>
                    </div>
                </div>

                {this.state.isDropping ? <Dragger
                    action={config.httpServerURL + '/user/file'}
                    multiple={false}
                    name="file"
                    showUploadList={false}
                    headers={{ "Authorization": localStorage.getItem("token") }}
                    beforeUpload={this._beforeUploading}
                    onChange={this._uploadingInfoChange}
                    className="drag-container">
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">Clique ou arraste ficheiros para esta zona</p>
                    <p className="ant-upload-hint">Guarde os seus trabalhos</p>
                </Dragger> : <div className="storage-files-container animated slideInUp">
                        <List
                            grid={{
                                gutter: 8, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 8,
                            }}
                            locale={{
                                emptyText: <Empty description="Sem resultados. Arraste algum ficheiro para o guardar!" />
                            }}
                            dataSource={this.props.files}
                            renderItem={item => {
                                return (
                                    <List.Item>
                                        <FileCard fileSize={item.fileSize} isMobile={window.innerWidth < 600} delete={this._deleteFile} download={this._downloadFile} fileId={item.fileId} fileName={item.fileName} showInfo={this._getFileInfo} />
                                    </List.Item>
                                );
                            }}
                        />
                    </div>}

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.authentication.userId,
        files: state.storage.files,
        primaryColor: state.theme.primaryColor,
    };
};

const mapDispatchToProps = {
    requestFileDownload,
    requestUserFiles,
    requestFileDelete,
    requestAddFile
};

export default connect(mapStateToProps, mapDispatchToProps)(Storage);