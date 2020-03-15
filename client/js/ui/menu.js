import cookie from 'cookie-handler';
import { User } from '../store';

let user = {};

User.subscribe(() => user = User.getState());

let menuBtn = document.createElement('a');
menuBtn.classList.add('menu-btn');
menuBtn.innerHTML = '<i class="fas fa-bars fa-2x"></i>';
menuBtn.onclick = openMenu;
document.body.appendChild(menuBtn);

function openMenu() {
  let menu = document.createElement('div');
  let menuExit = document.createElement('a');
  let menuTitle = document.createElement('span');

  menuTitle.classList.add('pure-menu-heading');
  menuTitle.innerText = 'Share Code';

  menuExit.innerHTML = '<i class="fas fa-times fa-2x"></i>';
  menuExit.classList.add('menu-exit');
  menuExit.onclick = () => closeMenu(menu);

  menu.classList.add('menu', 'animated', 'fadeInRight');
  menu.classList.add('pure-menu' ,'custom-restricted-width');

  menu.appendChild(menuExit);
  menu.appendChild(menuTitle);
  createListMenu(menu);

  document.body.appendChild(menu);
  document.onkeyup = (key) => {
    if (key.code === 'Escape') {
      document.onkeyup = null;
      closeMenu(menu);
    }
  };
}

/**
 * @method createListMenu
 * @param { HTMLDivElement } menu 
 */

function createListMenu(menu) {
  let items = [
    {
      text: 'Save on Gist',
      icon: 'far fa-save',
      display: true
    },
    {
      text: 'LogOut',
      icon: 'fas fa-sign-out-alt',
      display: user.gitId ? true : false
    }
  ];
  let list = document.createElement('ul');
  list.classList.add('pure-menu-list');

  for (let i = 0; i < items.length; i++) {
    const item = document.createElement('li');
    item.classList.add('pure-menu-item');
    const action = document.createElement('a');
    if (items[i].icon) {
      action.innerHTML = `${items[i].text} <i class="${items[i].icon}"></i>`;
    } else {
      action.innerText = items[i].text;
    }
    
    action.classList.add('pure-menu-link', 'pointer');
    item.appendChild(action);
    
    if (items[i].display) list.appendChild(item);
  }

  menu.appendChild(list);
}

function closeMenu(menu) {
  menu.classList.replace('fadeInRight', 'fadeOutRight');
  setTimeout(() => {
    document.body.removeChild(menu);
  }, 1000);
}
