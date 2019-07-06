import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const merc = ['demo', 'heavy', 'spy',
              'engi', 'pyro', 'medic',
              'scout', 'soldier', 'sniper'
             ];

const Square =(props) => {
  let backImg = require(`./img/${merc[props.id]}-bw.png`);
  let clases = "square coin-flip";
  if(props.value) {
    clases = "square";
    if(props.value==='Red') backImg = require(`./img/${merc[props.id]}-red.png`);
    else backImg = require(`./img/${merc[props.id]}-blu.png`);
  }
  if(props.linea) if(props.linea.includes(props.id)) clases += " ganador"

  return (
    <button 
      className={clases}
      onClick={props.onClick}
      style={{
        backgroundImage: `url(${backImg})`,
      }}
    >
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        id={i}
        value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}
        linea={this.props.linea}
      />
    );
  }

  render() {

    return (
      <div className="board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  //<img src={ require('./images/image1.jpg') } />
  constructor(props){
    super(props);
    this.state={
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext:true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(
        0,
        this.state.stepNumber + 1
      );
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = this.state.xIsNext?'Red':'Blu';
      this.setState({
      history: history.concat([{squares: squares}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo = (step) =>{
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let linea = null;
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button 
            onClick={()=>this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if(winner){
      status = 'Winner: ' + winner.winner;
      linea = winner.cuadros;
    }

    else status = 'Next player: ' + (this.state.xIsNext?'Red':'Blu');

    return (
      <div className="game">
          <Board
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
            linea={linea}
          />
        <div className="titulos">
          <div className="main">tic tac toe</div>
          <div className="sadjoke">the closest thing to a team fortress 2 update so far</div>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return {winner: squares[a], cuadros: lines[i]};
    }
  }
  return null;
}