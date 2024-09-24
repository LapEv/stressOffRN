import {DownloadFile} from './DownloadFile';
import {updateImgDB, updateSoundPath} from './FirebaseFunction';

export const prepareCategoryForNewUser = (data, db) => {
  return new Promise(async (resolve, reject) => {
    let value = [];
    for (const item of data) {
      const {
        globalCategory,
        imgStorage,
        imgStorage_lt,
        title,
        category,
        ...obj
      } = item;
      obj.name = item.category;
      if (!obj.img) {
        obj.img = db.find(value => value.name === obj.name)?.img;
      }
      if (!obj.img) {
        obj.img = await DownloadFile(item.imgStorage, obj.name, '.png');
      }
      if (!obj.img_lt) {
        obj.img_lt = db.find(value => value.name === obj.name)?.img_lt;
      }
      if (!obj.img_lt) {
        obj.img_lt = await DownloadFile(
          item.imgStorage_lt,
          `${obj.name}_lt`,
          '.png',
        );
      }
      value.push(obj);
    }
    resolve(value);
  });
};

export const prepareSoundsForNewUser = (data, db) => {
  return new Promise(async (resolve, reject) => {
    let value = [];
    for (const item of data) {
      const {
        category,
        globalCategory,
        description,
        imgStorage,
        payment,
        storage,
        title,
        ...obj
      } = item;
      if (!obj.img) {
        obj.img = db.find(value => value.name === obj.name)?.img;
      }
      if (!obj.img) {
        obj.img = await DownloadFile(item.imgStorage, obj.name, '.png');
      }
      if (!obj.sound) {
        const sound = db.find(value => value.name === obj.name);
        obj.sound = sound?.sound ? sound.sound : '';
      }
      if (obj.location === 'device' && !obj.sound) {
        const objData = data.find(value => value.name === obj.name);
        obj.sound = await DownloadFile(objData.storage, obj.name, '.aac');
      }
      value.push(obj);
    }
    resolve(value);
  });
};

export const checkForCategoriesImage = (data, fulldata, uid, db) => {
  return new Promise(async (resolve, reject) => {
    let newData = [];
    for (const item of data) {
      if (!item.img || !item.img_lt) {
        const obj = fulldata.find(value => value.category === item.name);
        item.img = await DownloadFile(obj.imgStorage, item.name, '.png');
        item.img_lt = await DownloadFile(
          obj.imgStorage_lt,
          `${item.name}_lt`,
          '.png',
        );
        await updateImgDB(db, item.img, item.img_lt, item.id, uid);
      }
      newData.push(item);
    }
    resolve(newData);
  });
};

export const checkForImages = (data, fulldata, uid, db) => {
  return new Promise(async (resolve, reject) => {
    let newData = [];
    for (const item of data) {
      if (!item.img) {
        const obj = fulldata.find(value => value.name === item.name);
        item.img = await DownloadFile(obj.imgStorage, item.name, '.png');
        await updateImgDB(db, item.img, '', item.id, uid);
      }
      if (item.location === 'device' && !item.sound) {
        const obj = fulldata.find(value => value.name === item.name);
        item.sound = await DownloadFile(obj.storage, item.name, '.aac');
        await updateSoundPath(db, item.sound, item.id, uid);
      }
      newData.push(item);
    }
    resolve(newData);
  });
};
