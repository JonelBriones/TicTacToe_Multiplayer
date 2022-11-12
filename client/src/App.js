import { useState, useEffect } from 'react'
import './App.css'
import Square from './components/Square.component'
import { Patterns } from './components/Patterns.component'
function App() {
  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', ''])
  const [player, setPlayer] = useState('O')
  const [result, setResult] = useState({ winner: '', state: '' })
  const [playerTwo, setPlayerTwo] = useState('O')
  const [history, setHistory] = useState({ PlayerOne: 0, PlayerTwo: 0 })
  useEffect(() => {
    checkIfTie()
    checkWin()

    if (player == 'X') {
      setPlayer('O')
    } else {
      setPlayer('X')
    }
  }, [board])

  const chooseSquare = (square) => {
    if (result.winner) return
    setBoard(
      board.map((val, idx) => {
        if (idx === square && val === '') {
          return player
        }
        return val
      })
    )
  }
  const checkWin = () => {
    Patterns.forEach((currPattern) => {
      const firstPlayer = board[currPattern[0]]
      if (firstPlayer === '') return
      let foundWinningPattern = true
      currPattern.forEach((idx) => {
        if (board[idx] != firstPlayer) {
          foundWinningPattern = false
        }
      })
      if (foundWinningPattern) {
        let winner = ''
        if (player === 'X') winner = 'Player One'
        if (player === 'O') winner = 'Player Two'
        setResult({ winner: winner + '!', state: 'Winner is' })
        updateGameHistory(player)
      }
    })
  }
  const checkIfTie = () => {
    let filled = true
    board.forEach((square) => {
      if (square == '') {
        filled = false
      }
    })
    filled && setResult({ winner: 'None', state: 'Tie!' })
  }

  const restartGame = () => {
    setBoard(['', '', '', '', '', '', '', '', ''])
    setPlayer('O')
    setResult({ winner: '', state: '' })
  }

  const updateGameHistory = (winner) => {
    if (winner === 'X') {
      setHistory({ ...history, PlayerOne: history.PlayerOne + 1 })
    }
    if (winner === 'O') {
      setHistory({ ...history, PlayerTwo: history.PlayerTwo + 1 })
    }
  }

  return (
    <>
      <div className="App">
        <h1>Tic Tac Toe</h1>
        <span className="scoreboard">
          {history.PlayerOne} - {history.PlayerTwo}
        </span>
        <div className="board-container">
          <div className="board">
            <div className="row">
              <Square val={board[0]} chooseSquare={() => chooseSquare(0)} />
              <Square val={board[1]} chooseSquare={() => chooseSquare(1)} />
              <Square val={board[2]} chooseSquare={() => chooseSquare(2)} />
            </div>
            <div className="row">
              <Square val={board[3]} chooseSquare={() => chooseSquare(3)} />
              <Square val={board[4]} chooseSquare={() => chooseSquare(4)} />
              <Square val={board[5]} chooseSquare={() => chooseSquare(5)} />
            </div>
            <div className="row">
              <Square val={board[6]} chooseSquare={() => chooseSquare(6)} />
              <Square val={board[7]} chooseSquare={() => chooseSquare(7)} />
              <Square val={board[8]} chooseSquare={() => chooseSquare(8)} />
            </div>
          </div>
        </div>
        <button
          className="restart"
          onClick={restartGame}
          disabled={board.includes('X') && !result.winner}>
          Play Again
        </button>

        <span>
          {result.state} {result.winner}
        </span>
      </div>
    </>
  )
}

export default App
