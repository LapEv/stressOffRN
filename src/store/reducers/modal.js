import {MODAL_SHOW} from '../types';

const initialState = {
	typeMessage: '',
	show: false,
	title: '',
	message: '',
	buttonCancel: '',
	buttonYes: '',
};

export const modalReducer = (state = initialState, action) => {
	switch (action.type) {
		case MODAL_SHOW:
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};
