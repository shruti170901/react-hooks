// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, setSquares, history, setHistory, 
  localStorage, setLocalStorage, localStorageHistory, disabled,
  setDisabled, setLocalStorageHistory} = {}) {
  // 🐨 squares is the state for this component. Add useState for squares
  // const [localStorage, setLocalStorage] = useLocalStorageState(
  //   'squares', 
  //   Array(9).fill(null)
  // )
  // const [localStorageHistory, setLocalStorageHistory] = useLocalStorageState(
  //   'tic-tac-toe:history',
  //   []
  // )

  // const [squares, setSquares] = React.useState(
  //   // JSON.parse(window.localStorage.getItem('squares')) ?? 
  //   localStorage ??
  //   Array(9).fill(null)
  // )

  // const [history, setHistory] = React.useState(
  //   localStorageHistory
  // )

  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  React.useEffect(() => {
    // window.localStorage.setItem('squares', JSON.stringify(squares))
    setLocalStorage(squares)
    setLocalStorageHistory(history)
  }, [squares, setLocalStorage, history, setLocalStorageHistory]) 

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if(winner || squares[square]) return;
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    // 🐨 make a copy of the squares array
    // 💰 `[...squares]` will do it!)
    const squaresCopy = [...squares];
    // 🐨 set the value of the square that was selected
    // 💰 `squaresCopy[square] = nextValue`
    squaresCopy[square] = nextValue;
    // 🐨 set the squares to your copy
    setSquares(squaresCopy);
    
    let historyCopy = [...history]
    // we have to slice history
    const disabledIndex = disabled.findIndex(item => item === true)
    if(!disabled[disabled.length - 1]) {
      historyCopy = historyCopy.slice(0, disabledIndex + 1)
    }
    
    historyCopy.push(squaresCopy);
    setHistory(historyCopy)

    const disabledCopy = Array(historyCopy.length).fill(false)
    disabledCopy[disabledCopy.length - 1] = true
    setDisabled(disabledCopy)
  }

  function restart() {
    // 🐨 reset the squares
    // 💰 `Array(9).fill(null)` will do it!
    setSquares(Array(9).fill(null))
    setHistory([Array(9).fill(null)])
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      {/* <div className="status">{status}</div> */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  const [localStorage, setLocalStorage] = useLocalStorageState(
    'squares', 
    Array(9).fill(null)
  )
  const [localStorageHistory, setLocalStorageHistory] = useLocalStorageState(
    'tic-tac-toe:history',
    [Array(9).fill(null)]
  )

  const [squares, setSquares] = React.useState(
    // JSON.parse(window.localStorage.getItem('squares')) ?? Array(9).fill(null)
    localStorage
  )

  const [history, setHistory] = React.useState(
    localStorageHistory
  )

  const disabledCopy = Array(history.length).fill(false)
  disabledCopy[disabledCopy.length - 1] = true
  const [disabled, setDisabled] = React.useState(disabledCopy)

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)


  return (
    <div className="game">
      <div className="game-board">
        <Board 
          history={history} 
          localStorage={localStorage} 
          localStorageHistory={localStorageHistory}
          squares={squares}
          setSquares={setSquares}
          setHistory={setHistory}
          setLocalStorage={setLocalStorage}
          setLocalStorageHistory={setLocalStorageHistory}
          disabled={disabled}
          setDisabled={setDisabled}
        />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>
          <Moves 
            history={history} 
            localStorage={localStorage} 
            localStorageHistory={localStorageHistory}
            squares={squares}
            setSquares={setSquares}
            setHistory={setHistory}
            setLocalStorage={setLocalStorage}
            setLocalStorageHistory={setLocalStorageHistory}
            disabled={disabled}
            setDisabled={setDisabled}
          />
        </ol>
      </div>
    </div>
  )
}

function Moves({history, squares, setSquares, setHistory, 
  setLocalStorage, setLocalStorageHistory, localStorage, 
  localStorageHistory, disabled, setDisabled} = {}){

  return history.map(
    (move, idx) => <li><button
      key={idx}
      disabled={disabled[idx]}
      onClick={()=>{
        setSquares(move)
        const disabledCopy = Array(history.length).fill(false)
        disabledCopy[idx] = true
        setDisabled(disabledCopy)
      }}
    >
      {/* {JSON.stringify(move)} */}
      {idx === 0 ? 'Go to game start' : `Go to move #${idx}`}
      {disabled[idx] ? ' (current)' : ''}
    </button></li>
  )

}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
