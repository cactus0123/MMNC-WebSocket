const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Serve static files
app.use(express.static("public"));

let audioChunks = [];

io.on("connection", (socket) => {
  console.log("Client Connected");

  socket.emit("server_message", "You are now connected to the server!");

  //Handle incoming audio chunks
  socket.on("pushChunks", (chunk) => {
    //var buffer = Buffer.from(chunk);
    console.log("Received audio chunks: ", chunk);
    //audioChunks.push(buffer);
  });

  socket.on("audioStarted", (msg) => {
    console.log("Received Message: ", msg);
  });
});

app.get("/", (req, res) => {
  res.send("Websocket Server for MMNC");
});

http.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port 3000");
});
