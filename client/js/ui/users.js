import tippy from 'tippy.js';
import { Users, User } from '../store';

const usersContainer = document.getElementById('users');

Users.subscribe(() => {
  loadUsers(Users.getState());
});

function loadUsers(users) {
  for (let i = 0; i < users.length; i++) {
    const element = getUser(users[i]);

    if (!element) {
      addUser(users[i]);
    } else {
      updateUser(element. user);
    }
  }
}

function addUser(user, classes = []) {
  let img = document.createElement('img');
  img.id = user.id,
  img.src = user.avatar || `https://www.gravatar.com/avatar/${Date.now()}?&d=identicon&r=PG`;
  img.classList.add('avatar', ...classes);
  img.alt = user.username;

  addTooltip(img, user.username);

  usersContainer.appendChild(img);
}

/**
 * @method updateUser
 * @param { HTMLImageElement } element 
 * @param {*} user 
 * @param { Array<String> } classes 
 */

function updateUser(element, user, classes = []) {
  let img = element;
  img.id = user.id,
  img.src = user.avatar || `https://www.gravatar.com/avatar/${Date.now()}?&d=identicon&r=PG`;
  img.classList.value = `avatar ${classes.join(' ')}`
  img.alt = user.username;

  addTooltip(img, user.username);
}

function removeUsers() {
  let users = Users.getState();
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    removeUser(user);
  }
  Users.dispatch({
    type: 'clear'
  });
}

function removeUser(user) {
  let img = getUser(user.id);
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

function meUser(user) {
  let img = getUser(user.id);
  let old = document.getElementsByClassName('avatar me')

  if (old.length > 0) return updateUser(old[0], user, ['me'])
  if (!img) addUser(user, ['me']);
  else updateUser(img, user, ['me']);
}

export {
  removeUser,
  addUser,
  loadUsers,
  removeUsers,
  updateUser,
  meUser
}
