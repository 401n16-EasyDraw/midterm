'use strict';

const io = require('socket.io')(3000);
const draw = io.of('/draw');

draw.on('connection', socket => {
  console.log('Connection to hub made:', socket.id);

  socket.on('draw', payload => {
    draw.emit('read', payload);
  });

  socket.on('textWrite', payload => {
    draw.emit('textRead', payload);
  });

  socket.on('getAllHistories', () => {
    draw.emit('getAllHistories');
  });

  socket.on('sendAllHistories', payload => {
    draw.emit('deliveredAllHistories', payload);
  });

  socket.on('sendCurrHistory', payload => {
    draw.emit('deliveredCurrHistory', payload);
  });

  socket.on('deleteHistory', payload => {
    draw.emit('deleteHistory', payload);
  });

  socket.on('updateScroll', payload => {
    draw.emit('updateScroll', payload);
  });
});
