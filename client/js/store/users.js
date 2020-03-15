import { createStore } from 'redux';

function Users(users = [], action) {
  let user = action.user;

  switch (action.type) {
    case 'add':
    case 'update':
      let userIndex = users.findIndex((item) => item.id === user.id);

      if (userIndex > -1) users[userIndex] = user;
      else users.push(user);
      
      return users;
    case 'remove':
      let removeIndex = users.findIndex((item) => item.socketId === user);
      if (removeIndex > -1) users.splice(removeIndex, 1);
      
      return users;
    case 'clear':
      return [];
    default:
      return users;
  }
}

export default createStore(Users);
