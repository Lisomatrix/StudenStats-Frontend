import React from 'react';
import { List, Empty } from 'antd';

const data = [
    {
        title: 'homework 1',
        description: '123456789123456789',
        expireDate: '26/04/2001'
    },
    {
        title: 'homework 1',
        description: '123456789123456789',
        expireDate: '26/04/2001'
    },
    {
        title: 'homework 1',
        description: '123456789123456789',
        expireDate: '26/04/2001'
    }
];

export default class HomeWorkList extends React.Component {

    render() {
        return (
            <div>
                <div className="homework-list-item-title-container homework-list-item-container">
                    <div className="title">
                        <h3>Título</h3>
                    </div>
                    <div className="description">
                        <h3>Descrição</h3>
                    </div>
                    <div className="expire-date">
                        <h3>Prazo</h3>
                    </div>
                </div>
                <List
                    locale={{
                        emptyText: <Empty description="Sem resultados. Crie um trabalho!" />
                    }}
                    dataSource={data}
                    renderItem={item => {
                        return (
                            <List.Item>
                                <div className="homework-list-item-container">
                                    <div className="title">
                                        {item.title}
                                    </div>
                                    <div className="description">
                                        {item.description}
                                    </div>
                                    <div className="expire-date">
                                        {item.expireDate}
                                    </div>
                                </div>
                            </List.Item>
                        );
                    }}
                />
            </div>
        );
    }
}