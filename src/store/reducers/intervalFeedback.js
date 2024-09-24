import {INTERVAL_FEEDBACK} from '../types';

const initialState = {
	date: '',
};

export const IntervalFeedbackReducer = (state = initialState, action) => {
	switch (action.type) {
		case INTERVAL_FEEDBACK:
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};
