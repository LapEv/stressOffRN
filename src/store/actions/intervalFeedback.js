import {INTERVAL_FEEDBACK} from '../types';

export const IntervalFeedback = date => {
	return {
		type: INTERVAL_FEEDBACK,
		payload: date,
	};
};
