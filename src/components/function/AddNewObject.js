import React, {useEffect, useState} from 'react';
import {GetURL} from './FirebaseFunction';
import {useDispatch} from 'react-redux';
// import {
// 	AddSoundsDB,
// 	AddMusicsDB,
// 	AddBrainWavesDB,
// 	AddNotificationsDB,
// } from '../../store/actions/db';
// import {DB} from '../../db';
const RNFS = require('react-native-fs');
import store from '../../store/index';

const DownloadFile = async (data, notificationsId) => {
  const url = await GetURL(data.img);
  const DEST = RNFS.DocumentDirectoryPath;
  const fileName = '/' + data.name + '.png';
  const uri = 'file://' + DEST + fileName;

  RNFS.downloadFile({
    fromUrl: url,
    toFile: uri,
    headers: {
      Accept: 'application/json',
    },
    progressDivider: 10,
  })
    .promise.then(response => {
      if (response.statusCode == 200) {
        console.log('uri = ', uri);
        CheckDB(uri, data, notificationsId);
      } else {
        console.log('SERVER ERROR');
      }
    })
    .catch(err => {
      console.log('Error download file: ', err);
    });
};

const CheckDB = async (uriImg, data, notificationsId) => {
  const language = store.getState().language;
  const date = new Date();

  function padStr(i) {
    return i < 10 ? '0' + i : '' + i;
  }
  const dateStr = `${padStr(date.getDate())}.${padStr(
    1 + date.getMonth(),
  )}.${padStr(date.getFullYear())}  ${padStr(date.getHours())}:${padStr(
    date.getMinutes(),
  )}`;

  // if (uriImg) {
  // 	data.category === 'BrainWaves'
  // 		? (await DB.addBrainWaves(
  // 				data.name,
  // 				uriImg,
  // 				data.location,
  // 				'',
  // 				data.storage,
  // 				data.title,
  // 				data.description,
  // 				data.category,
  // 				true,
  // 		  ),
  // 		  await DB.addNotifications(
  // 				language.notifications.title,
  // 				language.notifications.commentBR + '"' + data.title + '"',
  // 				dateStr,
  // 				false,
  // 				'BrainWavesScreen',
  // 		  ),
  // 		  await store.dispatch(
  // 				AddBrainWavesDB({
  // 					id: Number(data.id),
  // 					name: data.name,
  // 					img: uriImg,
  // 					location: data.location,
  // 					sound: '',
  // 					storage: data.storage,
  // 					title: data.title,
  // 					description: data.description,
  // 					category: data.category,
  // 					new: true,
  // 				}),
  // 		  ),
  // 		  await store.dispatch(
  // 				AddNotificationsDB({
  // 					id: notificationsId,
  // 					title: language.notifications.title,
  // 					comment: language.notifications.commentBR + '"' + data.title + '"',
  // 					date: dateStr,
  // 					readed: false,
  // 					screen: 'BrainWavesScreen',
  // 				}),
  // 		  ))
  // 		: data.category === 'music'
  // 		? (await DB.addMusics(
  // 				data.name,
  // 				uriImg,
  // 				data.location,
  // 				'',
  // 				data.storage,
  // 				data.title,
  // 				data.description,
  // 				data.category,
  // 				true,
  // 		  ),
  // 		  await DB.addNotifications(
  // 				language.notifications.title,
  // 				language.notifications.commentMusic + '"' + data.title + '"',
  // 				dateStr,
  // 				false,
  // 				'MusicScreen',
  // 		  ),
  // 		  await store.dispatch(
  // 				AddMusicsDB({
  // 					id: Number(data.id),
  // 					name: data.name,
  // 					img: uriImg,
  // 					location: data.location,
  // 					sound: '',
  // 					storage: data.storage,
  // 					title: data.title,
  // 					description: data.description,
  // 					category: data.category,
  // 					new: true,
  // 				}),
  // 		  ),
  // 		  await store.dispatch(
  // 				AddNotificationsDB({
  // 					id: notificationsId,
  // 					title: language.notifications.title,
  // 					comment:
  // 						language.notifications.commentMusic + '"' + data.title + '"',
  // 					date: dateStr,
  // 					readed: false,
  // 					screen: 'MusicScreen',
  // 				}),
  // 		  ))
  // 		: (await DB.addSounds(
  // 				data.name,
  // 				uriImg,
  // 				data.location,
  // 				'',
  // 				data.storage,
  // 				data.title,
  // 				data.description,
  // 				data.category,
  // 				true,
  // 		  ),
  // 		  await DB.addNotifications(
  // 				language.notifications.title,
  // 				language.notifications.commentSounds + '"' + data.title + '"',
  // 				dateStr,
  // 				false,
  // 				'SoundsScreen',
  // 		  ),
  // 		  await store.dispatch(
  // 				AddSoundsDB({
  // 					id: Number(data.id),
  // 					name: data.name,
  // 					img: uriImg,
  // 					location: data.location,
  // 					sound: '',
  // 					storage: data.storage,
  // 					title: data.title,
  // 					description: data.description,
  // 					category: data.category,
  // 					new: true,
  // 				}),
  // 		  ),
  // 		  await store.dispatch(
  // 				AddNotificationsDB({
  // 					id: notificationsId,
  // 					title: language.notifications.title,
  // 					comment:
  // 						language.notifications.commentSounds + '"' + data.title + '"',
  // 					date: dateStr,
  // 					readed: false,
  // 					screen: 'SoundsScreen',
  // 				}),
  // 		  ));
  // }
};

export const AddNewObject = async (data, notificationsId) => {
  await DownloadFile(data, notificationsId);
};
