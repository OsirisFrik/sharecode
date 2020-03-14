require('dotenv').config();

const http = require('http');
const express = require('express');
const socketio = require('./server/socket');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const axios = require('axios').default;

const app = express();
const server = http.Server(app);
const io = socketio(server);
const gitReq = axios.create({
  baseURL: 'https://github.com',
  headers: {
    Accept: 'application/json'
  }
})

app.use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(`${__dirname}/public`))
  .use(cookieParser())
  .use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false
    }
  }));

server.listen(process.env.PORT, () => {
  console.log(`Server running on http://${process.env.HOST || 'localhost'}:${process.env.PORT}`);
});

app.get('/', (req, res) => {
  let hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
  res.redirect(`/${hash}`);
});

app.get('/login', async (req, res) => {
  try {
    let auth = await gitReq({
      url: 'login/oauth/access_token',
      method: 'POST',
      data: {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
      }
    }).then(data => data.data);

    if (auth.access_token) {
      res.cookie('github-token', auth.access_token);
    }
    console.log(data)
  } catch (err) {
    req.cookies.loginFail = true;
    if (req.cookies.room) {
      res.redirect(`/${req.cookies.room}`);
    } else {
      res.redirect('/');
    }
  }
});

app.get('/:room', (req, res) => {
  res.sendFile(`${__dirname}/public/src/index.html`);
});
