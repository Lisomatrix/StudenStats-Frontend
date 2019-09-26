import React from 'react';
import './../../styles/storage-config.less';
import { ChartCard, Field, MiniProgress } from 'ant-design-pro/lib/Charts';
import { Badge, Table, Checkbox, Button, Modal, Input, Select, message } from 'antd';
import { connect } from 'react-redux';
import { requestStorageIsAlive, requestStorageServers, requestNewStorageServer, requestRemoveStorageServer } from './../../redux/actions/restActions/storage';

const Option = Select.Option;
const confirm = Modal.confirm;

var dataFetched = false;
var aliveRequestsDone = 0;

function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

class StorageConfig extends React.Component {

    columns = [
        {
            title: 'Nº',
            dataIndex: 'storageNumber',
            key: 'storageNumber',
        },
        {
            title: 'Estado',
            dataIndex: 'state',
            key: 'state',
            render: (text) => <Badge className="status-dot" /*status="processing"*/ status={text ? "success" : "error"} />
        },
        {
            title: 'I.P.',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: 'Espaço Usado',
            dataIndex: 'usedSpace',
            key: 'usedSpace',
        },
        {
            title: 'Espaço Livre',
            dataIndex: 'freeSpace',
            key: 'freeSpace',
        },
        {
            dataIndex: 'delete',
            key: 'delete',
            render: (text, row, key) => {
                return <Button onClick={() => this._deleteStorageServer(row.key)} icon="delete" type="danger" shape="circle" />
            }
        }
    ]

    mobileColumns = [
        {
            title: 'Nº',
            dataIndex: 'storageNumber',
            key: 'storageNumber',
        },
        {
            title: 'Estado',
            dataIndex: 'state',
            key: 'state',
            render: (text) => <Badge className="status-dot" /*status="processing"*/ status={text ? "success" : "error"} />
        },
        {
            title: 'Espaço Livre',
            dataIndex: 'freeSpace',
            key: 'freeSpace',
        },
        {
            dataIndex: 'delete',
            key: 'delete',
            render: (text, row, key) => {
                return <Button onClick={() => this._deleteStorageServer(row.key)} icon="delete" type="danger" shape="circle" />
            }
        }
    ]

    state = {
        data: [],
        initialMount: true,
        totalSpace: 0,
        usedSpace: 0,
        addStorageServerModalVisible: false,
        addStorageSize: 0,
        addStorageIp: "",
        addServerLoading: false,
        storageDeleteLoading: false
    }

    _deleteStorageServer = (storageId) => {
        confirm({
            title: 'Tem a certeza que pretende eliminar?',
            content: 'Eliminar um servidor vai causar a perda de ficheiros. Este é um processo demorado!',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: () => {
                this.setState({ storageDeleteLoading: true }, () => {
                    const hide = message.loading('A eliminar..', 0);
                    this.props.requestRemoveStorageServer(storageId).then((x) => {
                        this.setState({ storageDeleteLoading: false });
                        hide();

                        if(x) {
                            message.success("Servidor de armazenamento eliminado!")
                        } else {
                            message.error("Erro ao eliminar servidor de armazenamento!")
                        }
                    });
                })
            }
        });
    }

    _checkStorageStatus = (storages) => {
        aliveRequestsDone = 0;

        storages.forEach(storage => {

            if (!storage.statusFetched) {

                this.props.requestStorageIsAlive(storage.storageId)
                    .then(() => {
                        aliveRequestsDone++;

                        if (aliveRequestsDone === storages.length) {
                            aliveRequestsDone = -1;
                        }
                    });
            }
        });
    }

    _addStorageServer = () => {
        this.setState({ addServerLoading: true }, () => {
            this.props.requestNewStorageServer({
                hasSlave: false,
                slaveIp: "",
                storageIp: this.state.addStorageIp,
                master: true,
                storageNumber: 0,
                totalSpace: this.state.addStorageSize * 1073741824
            }).then((result) => {

                if(result) {
                    message.success('Servidor de armazenamento adicionado!')
                } else {
                    message.error('Ocurreu um erro ao adicionar o servidor de amazenamento!');
                }

                this.setState({ initialMount: true, addServerLoading: false, addStorageServerModalVisible: false });
            });
        })
    }

    componentWillUnmount() {
        aliveRequestsDone = -1;
    }

    componentWillMount() {
        if (!dataFetched && !this.props.storages) {
            this.props.requestStorageServers();
        } else {
            this._checkStorageStatus(this.props.storages);
        }
    }

    componentDidMount() {
        if (this.state.data.length === 0) {
            this.forceUpdate();
        }
    }

    componentWillUpdate(nextProps, nextState) {

        if ((!dataFetched && nextProps.storages) || nextState.initialMount || aliveRequestsDone !== -1) {

            const data = [];

            if (nextProps.storages) {

                var totalSpace = 0;
                var usedSpace = 0;

                for (var i = 0; i < nextProps.storages.length; i++) {
                    data.push({
                        storageNumber: nextProps.storages[i].storageNumber,
                        state: nextProps.storages[i].status,
                        freeSpace: formatBytes(nextProps.storages[i].totalSpace - nextProps.storages[i].usedSpace),
                        usedSpace: formatBytes(nextProps.storages[i].usedSpace),
                        master: nextProps.storages[i].master,
                        ip: nextProps.storages[i].ip,
                        key: nextProps.storages[i].storageId
                    });

                    totalSpace += nextProps.storages[i].totalSpace;
                    usedSpace += nextProps.storages[i].usedSpace;
                }

                nextState.data = data;
                nextState.initialMount = false;
                nextState.usedSpace = usedSpace;
                nextState.totalSpace = totalSpace;

                this._checkStorageStatus(nextProps.storages);
            }
        }
    }

    render() {
        return (
            <div className="storage-config-container">
                <div className="storage-config">
                    <div className="storage-config-current-status-container">
                        <ChartCard
                            title="Armazenamento"
                            className="chart-card animated slideInDown"
                            total={formatBytes(this.state.totalSpace)}
                            footer={
                                <div className="storage-chart-footer">
                                    <Field style={{ width: '95%' }} label="Espaço livre: " value={formatBytes(this.state.totalSpace - this.state.usedSpace)} />
                                    <div style={{ paddingBottom: '8px' }}>
                                        <Button className="add-storage-btn" onClick={() => this.setState({ addStorageServerModalVisible: true })} type="primary">Adicionar Armazenamento</Button>
                                    </div>
                                </div>
                            }
                            contentHeight={46}
                        >
                            <MiniProgress color={this.props.primaryColor} percent={(this.state.usedSpace * 100) / this.state.totalSpace} strokeWidth={8} />
                        </ChartCard>
                    </div>

                    <div className="ant-card-bordered storage-containers animated slideInUp">
                        <Table
                            style={{
                                marginLeft: '5px',
                                marginRight: '5px'
                            }}
                            columns={window.innerWidth > 600 ? this.columns : this.mobileColumns}
                            dataSource={this.state.data}
                        />
                    </div>
                </div>

                <Modal
                    title="Novo Servidor de Armazenamento"
                    okButtonProps={{ loading: this.state.addServerLoading }}
                    visible={this.state.addStorageServerModalVisible}
                    okText="Adicionar"
                    onOk={this._addStorageServer}
                    onCancel={() => this.setState({ addStorageServerModalVisible: false })}
                >
                    <div className="add-storage-moda-cotent-container">
                        <div className="add-storage-ip-container">
                            <div className="flex-column">
                                <label>IP: </label>
                                <Input onChange={(value) => this.setState({ addStorageIp: value.target.value })} placeholder="Exemplo: 127.0.0.1" />
                            </div>

                            <div className="flex-column">
                                <label>Espaço Disponível: </label>
                                <Input onChange={(value) => this.setState({ addStorageSize: value.target.value })} type="number" placeholder="500" height={80} addonAfter="GB" />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        storages: state.storage.storages,
        primaryColor: state.theme.primaryColor,
    };
};

const mapDispatchToProps = {
    requestStorageIsAlive,
    requestStorageServers,
    requestNewStorageServer,
    requestRemoveStorageServer
};

export default connect(mapStateToProps, mapDispatchToProps)(StorageConfig);