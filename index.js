const express = require("express");
const app = express();
const stream = require("stream");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Serve static files
app.use(express.static("public"));

let audioStream = new stream.PassThrough();
let recordingEnded = false;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("register", (role) => {
    socket.emit(
      "server_message",
      "You are now connected to the server as " + role
    );
    console.log("Registered as:", role);

    if (role === "pusher") {
      // Handle incoming audio chunks
      socket.on("pushChunks", (chunk) => {
        if (!recordingEnded) {
          //console.log("Processing chunk: ", chunk.count);
          var buffer = Buffer.from(chunk.data);
          //console.log(`Received audio chunk${chunk.count}: `, buffer);
          buffer.chunkNumber = chunk.count;
          console.log("received time: ", chunk.time);
          buffer.sentTime = parseInt(chunk.time, 10);
          console.log("parsed time: ", chunk.time);
          audioStream.write(buffer);
          //console.log("finished processing chunk: ", chunk.count);
        }
      });

      audioStream.on("data", (chunk) => {
        //console.log("Received from socket:", chunk);
      });

      socket.on("audioStarted", (msg) => {
        console.log("Received Message: ", msg);
      });

      socket.on("audioEnded", (msg) => {
        console.log("Received Message: ", msg);
        recordingEnded = true;
        audioStream.removeAllListeners();
        audioStream.end();
        audioStream = new stream.PassThrough();
        recordingEnded = false;
      });
    } else if (role === "receiver") {
      console.log("monkey");
      audioStream.on("data", (buffer) => {
        const audioData = {
          count: buffer.chunkNumber,
          sentTime: buffer.sentTime,
          data: buffer,
        };
        console.log("pushing time: ", buffer.sentTime);
        socket.emit("audioStream", audioData);
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Websocket Server for MMNC");
});

http.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port 3000");
});
