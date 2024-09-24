import {MODAL_SHOW_MESSAGE} from '../types';

const initialState = {
	typeMessage: '',
	show: false,
	title: '',
	message: '',
	buttonCancel: '',
	buttonYes: '',
};

export const modalMessageReducer = (state = initialState, action) => {
	switch (action.type) {
		case MODAL_SHOW_MESSAGE:
			return {
				...state,
				...action.payload,
			};

		default:
			return state;
	}
};
