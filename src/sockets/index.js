const socketio = require('socket.io');
const redis = require('socket.io-redis');
const analyze = require('Sentimental').analyze;

module.exports.listen = function(app) {
  const io = socketio.listen(app);
  io.adapter(redis({ host: 'localhost', port: 6379 }));

  io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('data', ({ transcript, isFinal, eventIndex }) => {
      const { comparative } = analyze(transcript);
      
      socket.emit('analysis', { comparative: comparative.toFixed(2), isFinal, eventIndex });
    });
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  
  return io;
};