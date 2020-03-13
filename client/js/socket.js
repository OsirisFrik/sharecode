import EventEmitter from 'events';
import io from 'socket.io-client';
import Notification from './ui/notifications';
import {
  User,
  Users
} from './store';

class Socket extends EventEmitter {
  constructor(room, editor) {
    super();
    this.room = room;
    this.socket = io.connect({
      query: {
        room
      },
      forceNew: true
    });

    this.socket.on('connect', (data) => this.onConnect(data));
    this.socket.on('userjoin', (data) => this.onUserJoin(data));
    this.socket.on('merge', (data) => this.onMerge(data));
    this.socket.on('newEditor', (data) => this.onNewEditor(data));
    this.socket.on('+input', (data) => this.onAddInput(data));
    this.socket.on('+delete', (data) => this.onRemoveInput(data));

    User.subscribe(() => this.emitUpdateMyUser());
  }

  onConnect(data) {
    console.log('Socket connected');
    Notification.success('Connected');
    User.dispatch({
      type: 'update',
      user: {
        socketId: this.socket.id
      }
    })
  }

  onUserJoin(data) {
    if (data.socketId !== this.socket.id) {
      Users.dispatch({
        type: 'add',
        user: data
      });
    }
  }

  emitUpdateMyUser() {
    let user = User.getState();
    console.log(user);
    this.socket.emit('updateProfile', user);
  }

  onNewEditor(solicitor) {
    if (solicitor !== this.socket.id) {
      let me = User.getState();
      this.emit('getEditorValue', (value) => {
        this.socket.emit('toNewEditor', {
          solicitor,
          value,
          user: me
        });
      });
    }
  }

  onMerge(data) {
    if (data.solicitor === this.socket.id) {
      this.emit('merge', data.value);
    }
  }

  onAddInput({ sender, data }) {
    if (sender !== this.socket.id) {
      this.emit('+input', data);
    }
  }

  onRemoveInput({ sender, data }) {
    if (sender !== this.socket.id) {
      this.emit('+delete', data);
    }
  }
}

export default Socket;