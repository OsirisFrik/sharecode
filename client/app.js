import Socket from './js/socket';
import { User, Users } from './js/store';
import Editor from './js/editor';
import { removeUser, loadUsers } from './js/ui/users';

// Styles
import './style.scss';
import 'animate.css/animate.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/mode/javascript/javascript';

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
  loadUsers([user]);
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
