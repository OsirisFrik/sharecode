import { createStore } from 'redux';

function users(users = [], action) {
  switch (action.type) {
    case 'add':
      let userIndex = users.findIndex(item => 
        item.id === action.user.id ||
        item.socketId === action.user.socketId
      );
      if (userIndex > -1) {
        users[userIndex] = action.user;
      } else {
        users.push(action.user);
      }
      return users;
    case 'remove':
      let user = users.findIndex(
        item => item.id === action.user.id ||
        item.socketId === action.user.socketId
      );
      if (user > -1) {
        users.splice(user, 1);
      }
      return users;
    default:
      return users;
  }
}

function user(user = {}, action) {
  switch (action.type) {
    case 'update':
      Object.assign(user, action.user);
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
