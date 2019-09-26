import React, { Component } from 'react';
import './App.css';
import AppRouter from './containers/Neutral/app-router/app-router';
import moment from 'moment';
import 'moment/locale/pt';

class App extends Component {
	constructor(props) {
		super(props);

		moment.locale('pt');
	}

	render() {
		return (
			<div className="App">
				<AppRouter />
			</div>
		);
	}
}

export default App;
