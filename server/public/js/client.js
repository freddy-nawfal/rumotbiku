var socket = io.connect('http://localhost:8000');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});


$("#roomcode").submit(function(e){
  socket.emit('joinRoom', $("#codeid").val());
  e.preventDefault();
});

socket.on("joinedRoom", function(id) {
  console.log("Joined room: "+id);
});
