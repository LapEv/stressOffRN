import {MODAL_SHOW_MESSAGE} from '../types';

export const modalShowMessage = modalInfo => {
	return {
		type: MODAL_SHOW_MESSAGE,
		payload: modalInfo,
	};
};
