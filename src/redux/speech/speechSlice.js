import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import speechService from './speechService';

export const getLinks = createAsyncThunk('speech/links', async (_, thunkAPI) => {
	try {
		return await speechService.getLinks();
	} catch (error) {
		const message = error.response.data.message;
		return thunkAPI.rejectWithValue(message);
	}
});

export const addLink = createAsyncThunk('speech/addLink', async (link, thunkAPI) => {
	try {
		return await speechService.addLink(JSON.stringify(link));
	} catch (error) {
		const message = error.response.data.message;
		return thunkAPI.rejectWithValue(message);
	}
});

const initalState = {
	linksData: [],

	isLinksLoading: false,
	isLinksError: false,
	isLinksSuccess: false,
	isLinksMessage: '',

	isAddLinkLoading: false,
	isAddLinkError: false,
	isAddLinkSuccess: false,
	isAddLinkMessage: ''
};

export const speechSlice = createSlice({
	name: 'speech',
	initialState: initalState,
	reducers: {
		reset: (state) => {
			state.isAddLinkLoading = false;
			state.isAddLinkError = false;
			state.isAddLinkSuccess = false;
			state.isAddLinkMessage = '';
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getLinks.pending, (state) => {
			state.isLinksLoading = true;
		})
			.addCase(getLinks.fulfilled, (state, action) => {
				state.isLinksSuccess = true;
				state.isLinksLoading = false;
				state.linksData = action.payload;
			})
			.addCase(getLinks.rejected, (state, action) => {
				state.isLinksLoading = false;
				state.isLinksError = true;
				state.isLinksMessage = action.payload;
			})
			.addCase(addLink.pending, (state) => {
				state.isAddLinkLoading = true;
			})
			.addCase(addLink.fulfilled, (state) => {
				state.isAddLinkSuccess = true;
				state.isAddLinkLoading = false;
			})
			.addCase(addLink.rejected, (state, action) => {
				state.isAddLinkLoading = false;
				state.isAddLinkError = true;
				state.isAddLinkMessage = action.payload;
			});
	}
});

export const { reset } = speechSlice.actions;

export default speechSlice.reducer;
