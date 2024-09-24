import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {soundReducer} from './reducers/sounds';
import {musicReducer} from './reducers/music';
import {modalReducer} from './reducers/modal';
import {modalMessageReducer} from './reducers/modalMessage';
import {favoritesReducer} from './reducers/favorites';
import {themeReducer} from './reducers/theme';
import {DBReducer} from './reducers/db';
import {ProgressBarReducer} from './reducers/progressBar';
import {timerReducer} from './reducers/timer';
import {individualTimerReducer} from './reducers/individualTimer';
import {IntervalFeedbackReducer} from './reducers/intervalFeedback';
import {languageReducer} from './reducers/language';
import {userReducer} from './reducers/user';

const rootReducer = combineReducers({
  sound: soundReducer,
  music: musicReducer,
  modal: modalReducer,
  modalMessage: modalMessageReducer,
  favorites: favoritesReducer,
  theme: themeReducer,
  db: DBReducer,
  progressBar: ProgressBarReducer,
  timer: timerReducer,
  individualTimer: individualTimerReducer,
  intervalFeedback: IntervalFeedbackReducer,
  language: languageReducer,
  user: userReducer,
});

export default createStore(rootReducer, applyMiddleware(thunk));
