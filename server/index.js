const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const {
  users,
  getCurrentUser,
  userJoin,
  getRoomUser,
  userLeave,
} = require('./users')
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  // console.log(`${socket.id} has connected`)

  socket.on('join_room', ({ username, ready, room }) => {
    let letter = 'X'
    if (users.length === 1) {
      letter = 'O'
    }

    const user = userJoin(socket.id, username, ready, room, letter)
    socket.join(user.room)
    let message = `${user.username} joined the lobby.`
    socket.to(user.room).emit('user_joined', users[0], user, message, users)
  })

  socket.on('send_message', (data) => {
    console.log('sending to socket', data)
    socket.to(data.room).emit('recieved_message', data)
  })

  socket.on('choose_square', (data) => {
    console.log('Player turn over', data)
    socket.to(data.room).emit('recieved_square', data)
  })
  socket.on('end_game', (data) => {
    console.log('GAME OVER', data)
    socket.to(data.room).emit('end_game_info', data.result)
  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected`)
    const user = userLeave(socket.id)

    if (user) {
      socket
        .to(user.room)
        .emit('leave_room', `${user.username} has disconnected`)
    }
  })
})

server.listen(8000, () => {
  console.log('Server is running')
})
