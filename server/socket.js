const socket = require('socket.io');

function init(app) {
  const io = socket(app);

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

    socket.on('toNewEditor', ({
      solicitor,
      value,
      user
    }) => {
      io.to(solicitor).emit('merge', {
        solicitor,
        value,
        user
      });
    });

    socket.on('updateProfile', user => {
      io.to(room).emit('userJoin', user);
    });

    socket.on('disconnect', () => {
      io.to(room).emit('removeEditor', socket.id);
    });
    
  });

  return io;
}

module.exports = init;