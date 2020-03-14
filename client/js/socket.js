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
    this.socket.on('userJoin', (data) => this.onUserJoin(data));
    this.socket.on('merge', (data) => this.onMerge(data));
    this.socket.on('newEditor', (data) => this.onNewEditor(data));
    this.socket.on('removeEditor', (data) => this.onRemoveEditor(data));
    this.socket.on('+input', (data) => this.onAddInput(data));
    this.socket.on('+delete', (data) => this.onRemoveInput(data));
    this.socket.on('disconnect', (data) => this.onDisconnect(data));

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
    });
  }

  onDisconnect(data) {
    Notification.error('Disconnected!');
    this.emit('disconnected');
  }

  onUserJoin(data) {
    if (data.socketId !== this.socket.id) {
      Notification.info(`${data.username || 'NO NAME'} joined`);
      Users.dispatch({
        type: 'add',
        user: data
      });
    }
  }

  onRemoveEditor(data) {
    let users = Users.getState();
    let user;
    for (let i = 0; i < users.length; i++) {
      if (users[i].socketId === data) {
        user = users[i];
        break;
      }
    }
    if (user) {
      Notification.info(`${user.username || 'NO NAME'} disconnected`);
      this.emit('removeUser', user);
      Users.dispatch({
        type: 'remove',
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
      Users.dispatch({
        type: 'add',
        user: data.user
      })
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