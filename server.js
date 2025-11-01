const { Server } = require("socket.io")
const http = require("http")

const server = http.createServer()
const io = new Server(server, {
  cors: { origin: "*" },
})

io.on("connection", (socket) => {
  console.log("User connected")

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
})

server.listen(3001, () => {
  console.log("✅ Chat server running on port 3001")
})