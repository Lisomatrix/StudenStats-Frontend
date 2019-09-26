import React from 'react';
import { shallowEqual } from 'shouldcomponentupdate-children';
import { connect } from 'react-redux';
import { Button, Input, message } from 'antd';
import './../../../styles/message-management.less';
import { requestNewMessage } from './../../../redux/actions/restActions/message';

const { TextArea } = Input;

class MessageManagement extends React.Component {

    state = {
        subject: '',
        message: '',
        sendLoading: false
    }

    _sendMessage = () => {

        this.setState({ sendLoading: true }, () => {
            this.props.requestNewMessage(1, {
                subject: this.state.subject,
                message: this.state.message
            })
            .then(() => {
                message.success('Email enviado com sucesso!');
                this.setState({ sendLoading: false });
            })
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowEqual(this.props, nextProps, this.state, nextState);
    }

    render() {
        return (
            <div className="message-management-container">
                <div className="message-info-container animated slideInDown">
					<h1 style={{ margin: '0' }}>Envie um email para os encarregados de educação da sua direção de turma</h1>
				</div>
                <div className="ant-card-bordered message-management animated slideInUp">
                    <div className="subject-container">
                        <div className="subject-subcontainer">
                            <h2>Assunto:</h2>
                            <Input value={this.state.subject} onChange={(value) => this.setState({ subject: value.target.value })} placeholder="Assunto" />
                        </div>
                        <Button onClick={this._sendMessage} type="primary" icon={this.state.sendLoading ? 'loading' : 'mail'} className="send-btn">Enviar</Button>
                    </div>
                    <div className="message-container">
                        <h2>Messagem:</h2>
                        <TextArea value={this.state.message} onChange={(value) => this.setState({ message: value.target.value })} placeholder="Messagem..." rows={12} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    requestNewMessage
}

const mapStateToProps = (state) => {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageManagement);