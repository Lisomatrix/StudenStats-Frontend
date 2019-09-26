import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducer } from './redux/reducers/index';
import { LocaleProvider } from 'antd';
import ptPT from 'antd/lib/locale-provider/pt_PT';
import thunk from 'redux-thunk';

window.less.options.javascriptEnabled = true;

const newTheme = {
	backgroundColor: '#f0f2f5',
	dark: 'dark',
	headerColor: '#ffffff',
	primaryColor: '#1890ff',
	secondaryColor: '#1890ff',
	textPrimaryColor: '#000000a6',
	textSecondaryColor: '#000000a6',
	cardBackground: '#ffffff',
	iconColor: '#000000a6'
};

const persistentToken = localStorage.getItem('token');

var authentication = {};

if (persistentToken) {
	authentication = {
		persistentToken: persistentToken,
		persistent: true,
		authorized: true
	};
}

const initialState = {
	theme: newTheme,
	authentication: authentication,
	connect: {
		connected: true
	}
};


const store = createStore(
	rootReducer,
	initialState,
	compose(
		applyMiddleware(thunk),
		// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // TODO REMOVE ON PRODUCTION
	)
);

ReactDOM.render(
	<Provider store={store}>
		<LocaleProvider locale={ptPT}>
			<App />
		</LocaleProvider>
	</Provider>,
	document.getElementById('root')
);
registerServiceWorker();

var deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
	// Prevent Chrome 76 and later from showing the mini-infobar
	e.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = e;
	console.log(e);
	deferredPrompt.prompt();
	deferredPrompt.userChoice.then((choice) => {
		if (choice.outcome === 'accepted') {
			console.log('user accepted');
		} else {
			console.log('user refused')
		}
	});
});