require('dotenv').config();

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const session = require('express-session');
const axios = require('axios');

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(`${__dirname}/public`))
  .use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true
    }
  }));

server.listen(process.env.PORT, () => {
  console.log(`Server running on http://${process.env.HOST || 'localhost'}:${process.env.PORT}`);
});

app.get('/', (req, res) => {
  let hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);

  res.redirect(`/${hash}`);
});

app.get('/logins', (req, res) => {
  axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code
  }).then((data) => {
    console.log(data.data)
  })
  res.send('login');
});

app.get('/:room', (req, res) => {
  res.sendFile(`${__dirname}/public/src/index.html`);
});

io.on('connection', socket => {
  let room = socket.handshake.query.room;

  socket.join(room);
  socket.on('+input', (data) => {
    io.to(room).emit('+input', {
      sender: socket.id,
      data
    });
  });
  socket.on('+delete', (data) => {
    io.to(room).emit('+delete', {
      sender: socket.id,
      data
    });
  })
  io.to(room).emit('newEditor', socket.id);

  socket.on('toNewEditor', ({ solicitor, value, user }) => {
    io.to(solicitor).emit('merge', { solicitor, value, user });
  });

  socket.on('updateProfile', user => {
    io.to(room).emit('userJoin', user);
  });

  socket.on('disconnect', () => {
    io.to(room).emit('removeEditor', socket.id);
  })
});
