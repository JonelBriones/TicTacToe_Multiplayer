import React, { useState, useEffect } from 'react'
import '../App.css'
import Square from '../components/TicTacToe/Square.component'
import { Patterns } from '../components/TicTacToe/Patterns.component'

const TicTacToe = ({ socket, room, defaultPlayer }) => {
  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', ''])
  const [result, setResult] = useState({ winner: '', state: '' })
  const [history, setHistory] = useState({ PlayerOne: 0, PlayerTwo: 0 })
  const [squaresPicked, setSquaredPicked] = useState('')
  const [letter, setLetter] = useState('O')
  const [yourTurn, setYourTurn] = useState(true)
  //   const [opponent, setOpponent] = useState({
  //     username: '',
  //   })
  //   const isGameStarted = board.includes('X')
  useEffect(() => {
    checkIfTie()
    checkWin()
    // if (letter == 'X') {
    //   setLetter('O')
    // } else {
    //   setLetter('X')
    // }
    turnOver()
  }, [squaresPicked])

  const chooseSquare = (square) => {
    if (result.winner) return
    if (!yourTurn) return
    // if (!opponent) return
    // console.log('CURRENT BOARD', board)

    setBoard(
      board.map((val, idx) => {
        if (idx === square && val === '') {
          setYourTurn(false)
          return letter
        }
        return val
      })
    )
    setSquaredPicked(square)
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
        if (letter === 'X') winner = 'Player One'
        if (letter === 'O') winner = 'Player Two'
        let updateResult = { winner: winner + '!', state: 'Winner is' }
        setResult(updateResult)
        endGame(updateResult)
      }
    })
  }
  const endGame = async (updateResult) => {
    let data = {
      result: updateResult,
      room,
    }
    await socket.emit('end_game', data)
  }
  useEffect(() => {
    console.log('RESULT HAS BEEN ANNOUNCED')
    socket.on('end_game_info', (data) => {
      console.log('END GAME', data)
      setResult(data)
    })
  }, [result])

  const turnOver = async () => {
    let data = {
      board,
      room,
      letter,
    }
    await socket.emit('choose_square', data)
  }

  useEffect(() => {
    console.log('updated board')
    socket.on('recieved_square', (data) => {
      setBoard(data.board)
      setYourTurn(true)
      if (data.letter === 'X') {
        setLetter('O')
      }
      if (data.letter === 'O') {
        setLetter('X')
      }
    })
    // console.log('starting match')
    // socket.on('user_joined', (playerOne, playerTwo, message, listOfPlayers) => {
    //   console.log(message, playerOne, playerTwo, listOfPlayers)
    //   //   setPlayer(playerOne)
    //   setOpponent(playerTwo)
    // })
  }, [board])

  const restartGame = () => {
    console.log('Resetting Board')
    setBoard(['', '', '', '', '', '', '', '', ''])
    setResult({ winner: '', state: '' })
    setSquaredPicked([])
    // setLetter('O')
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
      <h1>Tic Tac Toe</h1>
      {/* {opponent.username ? (
        <span className="scoreboard">
          {`${history.PlayerOne} - ${history.PlayerTwo}`}
        </span>
      ) : (
        <span className="scoreboard">
          waiting for opponent...{opponent.username}
        </span>
      )} */}
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

      <div className="winner-model">
        <span>
          {result.state} {result.winner}
        </span>
      </div>
    </>
  )
}

export default TicTacToe
