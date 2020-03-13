import tippy from 'tippy.js';
import { Users, User } from '../store';

import 'tippy.js/dist/tippy.css';

const usersContainer = document.getElementById('users');

Users.subscribe(() => {
  loadUsers(Users.getState());
});

function loadUsers(users) {
  console.log(users);
  for (let i = 0; i < users.length; i++) {
    const element = getUser(users[i]);

    if (!element) {
      addUser(users[i]);
    } else {
      updateUser(element. user);
    }
  }
}

function addUser(user) {
  let img = document.createElement('img');
  img.id = user.socketId,
  img.src = user.avatar || `https://www.gravatar.com/avatar/${Date.now()}?&d=identicon&r=PG`;
  img.classList.add('avatar');
  img.alt = user.username;

  addTooltip(img, user.username);

  usersContainer.appendChild(img);
}

function updateUser(element, user) {
  let img = element;
  img.id = user.socketId,
    img.src = user.avatar || `https://www.gravatar.com/avatar/${Date.now()}?&d=identicon&r=PG`;
  img.classList.add('avatar');
  img.alt = user.username

  addTooltip(img, user.username);

  usersContainer.appendChild(img);
}

function removeUser(user) {
  let img = getUser(user.socketId);
  if (img) {
    usersContainer.removeChild(img);
  }
}

function addTooltip(target, content) {
  tippy(target, {
    content
  });
}

function getUser(id) {
  return document.getElementById(id);
}

function getAllUsers() {
  return document.getElementsByClassName('avatar-remote');
}

export {
  removeUser,
  addUser,
  loadUsers
}
