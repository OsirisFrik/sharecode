import cookie from 'cookie-handler';
import tippy from 'tippy.js';
import { User } from '../store';

let btnLogin = document.createElement('button');
btnLogin.id = 'login-btn';
btnLogin.classList.add('login-btn', 'pure-button');
btnLogin.onclick = openModalLogin;
btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i>';
tippy(btnLogin, {
  content: 'Login',
  placement: 'left'
})

function openModalLogin() {
  let modal = document.createElement('div');
  let modalBody = document.createElement('div');
  let title = document.createElement('h3');
  let btn = document.createElement('button');

  modal.classList.add('modal', 'animated', 'slideIn');
  modalBody.classList.add('modal-body', 'animated', 'slideInDown');
  title.classList.add('modal-title');
  btn.classList.add('pure-button', 'modal-btn');

  title.innerText = 'Login';
  btn.innerHTML = '<i class="fab fa-github"></i> GitHub Login';

  btn.onclick = onLogin;
  document.onkeyup = (key)=> {
    if (key.code === 'Escape') {
      document.onkeyup = null;

      modal.classList.replace('slideIn', 'slideOut');
      modalBody.classList.replace('slideInDown', 'slideOutUp');
      
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 1000);
    }
  }
  
  modalBody.appendChild(title);
  modalBody.appendChild(btn);
  modal.appendChild(modalBody);

  document.body.appendChild(modal);
}

User.subscribe(() => {
  let user = User.getState();
  if (user.gitId && document.getElementById('login-btn')) {
    document.body.removeChild(btnLogin);
  } else {
    document.body.appendChild(btnLogin);
  }
})

function onLogin() {
  cookie.set('room', location.pathname.substr(1));
  location.href = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.GH_CLIENT}`;
}