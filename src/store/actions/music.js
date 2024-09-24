import {CHANGE_STATE_MUSIC} from '../types';

export const ChangeStateMusic = music => {
	return {
		type: CHANGE_STATE_MUSIC,
		payload: music,
	};
};
