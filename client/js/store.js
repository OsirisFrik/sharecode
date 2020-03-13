import { createStore } from 'redux';

let _user = getFromLocalStg('user') || {};

function getFromLocalStg(key) {
  let value = localStorage.getItem(key);
  if (key ===  'user') return JSON.parse(value || "{}");
}

function saveLocalStg(key, value) {
  localStorage.setItem(key, typeof value !== 'string' ? JSON.stringify(value) : value );
}

function users(users = [], action) {
  switch (action.type) {
    case 'add':
      console.log(users);
      let userIndex = users.findIndex(item => {
        if (typeof item.id !== 'undefined') {
          return item.id === action.user.id;
        } else {
          return item.socketId === action.user.socketId;
        }
      });
      if (userIndex > -1) {
        users[userIndex] = action.user;
      } else {
        users.push(action.user);
      }
      return users;
    case 'remove':
      let user = users.findIndex((item) => item.socketId === action.user);
      if (user > -1) {
        users.splice(user, 1);
      }
      return users;
    default:
      return users;
  }
}

function user(user = _user, action) {
  switch (action.type) {
    case 'update':
      Object.assign(user, action.user);
      saveLocalStg('user', user);
      return user; 
    default:
      return user;
  }
}

let UsersStore = createStore(users);
let UserStore = createStore(user);

export {
  UsersStore as Users,
  UserStore as User
}
