import io from 'socket.io-client';
import CodeMirror from 'codemirror';
import { addUser } from './users';

// Styles
import './style.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/mode/javascript/javascript';

var users = {};
const room = location.pathname.substring(1);
const editor = CodeMirror(document.body, {
  mode: 'javascript',
  lineNumbers: true,
  theme: 'material-darker'
});
const socket = io.connect({
  query: {
    room
  }
});

function init() {
  let btn = document.getElementById('login');
  btn.onclick = login;
}

function login() {
  location.href = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.GH_CLIENT}`
}

socket.on('connect', () => {
  console.log('connected');
  let name = localStorage.getItem('username');

  if (!name) {
    name = prompt('Username', 'dummy');
    localStorage.setItem('username', name);
  }

  users[socket.id] = {
    name,
    img: `https://www.gravatar.com/avatar/${Date.now()}?&d=identicon&r=PG`
  }
  socket.emit('updateProfile', users[socket.id]);
});


editor.on('change', (instance, change) => {
  socket.emit(change.origin, change);
});

socket.on('+input', remoteAdd);
socket.on('+delete', remoteAdd);
socket.on('newEditor', newEditor);
socket.on('merge', merge);
socket.on('addUser', user => {
  Object.assign(users, user);
  console.log(user);
  addUser(user[Object.keys(user)[0]]);
});

/**
 * @method remoteAdd
 * @param { Object } data
 * @param { String } data.sender
 * @param { CodeMirror.EditorChangeLinkedList } data.data
 */

function remoteAdd({ sender, data }) {
  if (sender !== socket.id) {
    let cursor = editor.getCursor();
    editor.replaceRange(data.text, data.from, data.to);
    resetCursor(cursor);
  }
}

function newEditor(solicitor) {
  if (solicitor !== socket.id) {
    let value = editor.getValue();
    socket.emit('toNewEditor', {
      value,
      solicitor
    });
  }
}

function merge({ sender, value }) {
  if (sender !== socket.id) {
    editor.setValue(value);
  }
}

function resetCursor(prev) {
  // editor.setCursor(prev);
}

window.socket = socket;
window.editor = editor;

window.onload = init();
