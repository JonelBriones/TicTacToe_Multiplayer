import React, { useState } from 'react'
import io from 'socket.io-client'
import { useEffect } from 'react'
import Chat from '../components/Chat/Chat.component'
import TicTacToe from './TicTacToe.route'
const socket = io.connect('http://localhost:8000')

const Login = () => {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [showChat, setShowChat] = useState(false)
  // const [playersInLobby, setPlayersInLobby] = useState([])
  const [defaultPlayer, setPlayer] = useState({})
  const [opponent, setOpponent] = useState({})
  const joinRoom = async () => {
    if (username && room) {
      console.log('joined room ', room)
      let createPlayer = {
        username,
        ready: true,
        room,
      }
      console.log('waiting for socket...')
      await socket.emit('join_room', createPlayer)
      console.log('data sent to socket')
      setShowChat(true)
      let createPlayerSocket = { ...createPlayer, id: socket.id }
      setPlayer(createPlayerSocket)
    }
  }

  const leave = () => {
    setPlayer({})
    setShowChat(false)
    setOpponent({})
  }

  return (
    <>
      {!showChat ? (
        <div>
          <h3>Join chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="number"
            placeholder="Room ID..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join a Room</button>
        </div>
      ) : (
        <>
          <button onClick={leave}>Leave</button>
          <TicTacToe
            socket={socket}
            room={room}
            username={username}
            defaultPlayer={defaultPlayer}
          />
          <Chat socket={socket} room={room} opponent={opponent.username} />
        </>
      )}
    </>
  )
}

export default Login
