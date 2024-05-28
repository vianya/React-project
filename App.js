import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winnerInfo }) {
  function handleClick(i) {
    if (winnerInfo.winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  function renderSquare(i) {
    const highlight = winnerInfo.line && winnerInfo.line.includes(i);
    return <Square value={squares[i]} onSquareClick={() => handleClick(i)} highlight={highlight} />;
  }

  function renderBoard() {
    const board = [];
    for (let row = 0; row < 3; row++) {
      const squares = [];
      for (let col = 0; col < 3; col++) {
        squares.push(renderSquare(row * 3 + col));
      }
      board.push(<div key={row} className="board-row">{squares}</div>);
    }
    return board;
  }

  const status = winnerInfo.winner
    ? `Winner: ${winnerInfo.winner}`
    : squares.every(Boolean)
    ? 'Draw'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <div className="status">{status}</div>
      {renderBoard()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, location) {
    const nextHistory = history.slice(0, currentMove + 1).concat([{ squares: nextSquares, location }]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSort() {
    setAscending(!ascending);
  }

  const winnerInfo = calculateWinner(currentSquares);

  const moves = history.map((step, move) => {
    const desc = move
      ? `Go to move #${move} (${Math.floor(step.location / 3) + 1}, ${(step.location % 3) + 1})`
      : 'Go to game start';
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{move}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{desc}</button>
        )}
      </li>
    );
  });

  if (!ascending) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winnerInfo={winnerInfo} />
      </div>
      <div className="game-info">
        <button onClick={toggleSort}>
          {ascending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}
