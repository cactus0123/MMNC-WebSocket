const express = require("express");
const app = express();
const stream = require("stream");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Serve static files
app.use(express.static("public"));

let audioStream = new stream.PassThrough();

io.on("connection", (socket) => {
  console.log("Client Connected");

  socket.emit("server_message", "You are now connected to the server!");

  // Handle incoming audio chunks
  socket.on("pushChunks", (chunk) => {
    console.log("Processing chunk: ", chunk[1]);
    var buffer = Buffer.from(chunk[0]);
    console.log(`Received audio chunk${chunk[1]}: `, buffer);
    audioStream.write(buffer);
    console.log("finsihsed processing chunk: ", chunk[1]);
  });

  audioStream.on("data", (chunk) => {
    console.log("Received from socket:", chunk);
  });

  socket.on("audioStarted", (msg) => {
    console.log("Received Message: ", msg);
  });

  socket.on("audioEnded", (msg) => {
    console.log("Received Message: ", msg);
    audioStream = new stream.PassThrough();
  });
});

app.get("/", (req, res) => {
  res.send("Websocket Server for MMNC");
});

http.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port 3000");
});
