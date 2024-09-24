import {PROGRESS_BAR_SHOW} from '../types';

const initialState = {
	showDownload: false,
	showDeleteAll: false,
	storage: '',
	name: '',
	category: '',
	id: '',
	title: '',
};

export const ProgressBarReducer = (state = initialState, action) => {
	switch (action.type) {
		case PROGRESS_BAR_SHOW:
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};
