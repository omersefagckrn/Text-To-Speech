import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import { store } from './redux/store';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<Provider store={store}>
		<Toaster
			toastOptions={{
				duration: 2000,
				position: 'top-right'
			}}
			reverseOrder={false}
		/>
		<App />
	</Provider>
);
