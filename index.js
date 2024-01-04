const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Serve static files
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Client Connected");

  //Handle incoming audio chunks
  socket.on("audio_chunk", (chunk) => {
    console.log("Received audio chunk: ", chunk);
  });

  socket.emit("server_message", "You are now connected to the server!");
});

http.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port 3000");
});
