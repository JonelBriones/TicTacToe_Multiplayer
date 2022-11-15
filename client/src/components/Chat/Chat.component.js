import React, { useState, useEffect, useRef } from 'react'
import './chat.styles.css'
const Chat = ({ socket, username, room, opponent }) => {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageHistory, setMessageHistory] = useState([])
  const messageEndRef = useRef(null)
  const sendMessage = async () => {
    if (currentMessage) {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
        id: socket.id,
      }
      await socket.emit('send_message', messageData)
      setMessageHistory((list) => [...list, messageData])
      console.log('sending a new message', messageHistory)
    }
  }
  useEffect(() => {
    console.log('recieved a new message')
    console.log('message history', messageHistory)
    socket.on('recieved_message', (data) => {
      setMessageHistory([...messageHistory, data])
      // setMessageHistory((list) => [...list, data])
      console.log('new message!')
    })
    messageEndRef.current?.scrollIntoView()
  }, [messageHistory])

  const onSubmitHandler = (e) => {
    e.preventDefault()

    sendMessage()
    setCurrentMessage('')
  }
  const onChangeHandler = (e) => {
    setCurrentMessage(e.target.value)
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <p>LIVE CHAT</p>
      </div>
      <div className="chat-body">
        {messageHistory.map((message, idx) => (
          <div key={idx} className="message-container">
            <p
              className={
                message.id === socket.id ? 'sent-message' : 'recieved-message'
              }>
              {message.message}
            </p>
            <span className="message-time">{message.time}</span>
            <div ref={messageEndRef} />
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <form onSubmit={onSubmitHandler}>
          <input
            type="text"
            placeholder="type..."
            value={currentMessage}
            onChange={(e) => onChangeHandler(e)}
          />
          <button className="chat-send-btn" type="submit">
            &#9658;
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat
