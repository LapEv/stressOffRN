import {CHANGE_STATE_MUSIC} from '../types';

const initialState = {
	id: 0,
	playing: false,
	volume: 1.0,
	// mixName: '',
	musicStart: false,
	startApp: true,
};

export const musicReducer = (state = initialState, action) => {
	switch (action.type) {
		case CHANGE_STATE_MUSIC:
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};
