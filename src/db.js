import {openDatabase} from 'react-native-sqlite-storage';
const db = openDatabase({name: 'meditationSounds.db'});
export class DB {}
