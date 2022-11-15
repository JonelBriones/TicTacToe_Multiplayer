import React from 'react'
import './App.css'
import TicTacToe from './routes/TicTacToe.route'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './routes/Login.component'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route element={<TicTacToe />} path="/lobby" /> */}
          <Route element={<Login />} path="/" />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
