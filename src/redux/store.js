import { configureStore } from '@reduxjs/toolkit';
import speechReducer from './speech/speechSlice';

export const store = configureStore({
	reducer: {
		speech: speechReducer
	},
	devTools: process.env.NODE_ENV !== 'production'
});
