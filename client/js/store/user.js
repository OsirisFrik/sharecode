import { createStore } from 'redux';

let _user = getFromLocalStg('user');

function getFromLocalStg(key) {
  let value = localStorage.getItem(key);
  return JSON.parse(
    value ||
    `{ "id": "${Math.floor(Math.random() * 0xFFFFFF).toString(16)}" }`
  );
}

function setLocalStg(key, value) {
  localStorage.setItem(key, typeof value !== 'string' ? JSON.stringify(value) : value);
}

/**
 * @method User
 * @param { Object } user 
 * @param { Object } action 
 */

function User(user = _user, action) {
  switch (action.type) {
    case 'update':
      Object.assign(user, action.user);
      setLocalStg('user', user);
      return user;
    default:
      return user;
  }
}

export default createStore(User);
