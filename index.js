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

  socket.emit(
    "server_message",
    `You are now connected to the server as ${role}`
  );

  socket.on("register", (role) => {
    console.log("Registered as: ", role);

    if (role === "pusher") {
      // Handle incoming audio chunks
      socket.on("pushChunks", (chunk) => {
        console.log("Processing chunk: ", chunk.count);
        var buffer = Buffer.from(chunk.data);
        console.log(`Received audio chunk${chunk.count}: `, buffer);
        audioStream.write(buffer);
        console.log("finsihsed processing chunk: ", chunk.count);
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
    } else if (role === "receiver") {
      console.log("monkey");
    }
  });
});

app.get("/", (req, res) => {
  res.send("Websocket Server for MMNC");
});

http.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port 3000");
});
