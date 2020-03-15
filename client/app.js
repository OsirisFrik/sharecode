import Socket from './js/libs/socket';
import { User, Users } from './js/store';
import Editor from './js/libs/editor';
import { removeUser, meUser, removeUsers } from './js/ui/users';
import './js/ui/login';
import './js/libs/github';
import './js/ui/menu';

import '@fortawesome/fontawesome-free/js/all';

// Styles
import './style/style.scss';
import './style/buttons-min.css';
import './style/menus-min.css';
import 'animate.css/animate.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/mode/javascript/javascript';
import 'tippy.js/dist/tippy.css';

User.subscribe(() => {
  let user = User.getState();
  if (!user.username) {
    let username = prompt('Username', 'anon');
    User.dispatch({
      type: 'update',
      user: {
        ...user,
        username,
        avatar: `https://www.gravatar.com/avatar/${Date.now()}?&d=identicon&r=PG`
      }
    });
  }
  meUser(user);
});

const editor = new Editor();
const room = location.pathname.substring(1);
const socket = new Socket(room);

editor.on('change', (change) => {
  if (['+input', '+delete'].includes(change.origin)) {
    socket.socket.emit(change.origin, change);
  }
});

socket.on('+input', editor.remoteEdit);
socket.on('+delete', editor.remoteEdit);
socket.on('merge', (value) => editor.setValue(value));
socket.on('getEditorValue', (cb) => cb(editor.getValue()));
socket.on('removeUser', (user) => removeUser(user));
socket.on('disconnected', () => removeUsers());
