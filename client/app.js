import CodeMirror from 'codemirror';
import Socket from './js/socket';
import { User, Users } from './js/store';
import Notification from './js/ui/notifications';

// Styles
import './style.scss';
import 'animate.css/animate.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/mode/javascript/javascript';

User.subscribe(() => {
  console.log(User.getState());
});
Users.subscribe(() => {
  console.log(Users.getState());
})

var users = {};
const room = location.pathname.substring(1);
const editor = CodeMirror(document.body, {
  mode: 'javascript',
  lineNumbers: true,
  theme: 'material-darker'
});
const socket = new Socket(room, editor);

socket.on('merge', (value) => mergeValue(value));
socket.on('getEditorValue', (cb) => {
  cb(editor.getValue());
});

function mergeValue(value) {
  editor.setValue(value);
}

editor.on('change', (instance, change) => {
  socket.socket.emit(change.origin, change);
});

socket.on('+input', remoteModify);
socket.on('+delete', remoteModify);

function remoteModify(value) {
  let cursor = editor.getCursor();
  editor.replaceRange(value.text, value.from, value.to);
  editor.setCursor(cursor);
}
