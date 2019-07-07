import React from 'react';
import ReactDOM from 'react-dom';
import SoundFX from 'sound-fx';

import './index.css';

//sound exporting
import flip from './audio/flip1.wav'
import demo from './audio/demo.mp3'
import engi from './audio/engi.mp3'
import heavy from './audio/heavy.mp3'
import medic from './audio/medic.mp3'
import pyro from './audio/pyro.mp3'
import scout from './audio/scout.mp3'
import sniper from './audio/sniper.mp3'
import soldier from './audio/soldier.mp3'
import spy from './audio/spy.mp3'
import stalemate from './audio/stalemate.mp3'

const sfx = new SoundFX();
sfx.load(flip, 'flip');
sfx.load(demo, 'demo');
sfx.load(engi, 'engi');
sfx.load(heavy, 'heavy');
sfx.load(medic, 'medic');
sfx.load(pyro, 'pyro');
sfx.load(scout, 'scout');
sfx.load(sniper, 'sniper');
sfx.load(soldier, 'soldier');
sfx.load(spy, 'spy');
sfx.load(stalemate, 'stalemate');

const merc = ['demo', 'heavy', 'spy',
              'engi', 'pyro', 'medic',
              'scout', 'soldier', 'sniper'
             ];

const Square =(props) => {
  let backImg = require(`./img/${merc[props.id]}-bw.png`);
  let clases = "square coin-flip";
  let sound = "flip";
  if(props.value) {
    clases = "square";
    sound = "";
    if(props.value==='Red') backImg = require(`./img/${merc[props.id]}-red.png`);
    else backImg = require(`./img/${merc[props.id]}-blu.png`);
  }
  if(props.linea) if(props.linea.includes(props.id)) clases += " ganador";
 return (
    <button 
      className={clases}
      onClick={props.onClick}
      style={{ backgroundImage: `url(${backImg})`}}
      onMouseOver={() => {sfx.play(sound);}}
    >
    </button>
  );
}

const ScoreBoard = (props) =>{
  return(
    <div className="score-board">
      <TeamBoard
        active={!props.xIsNext}
        class=" blu"
        team="BLU"
      />
      <TeamBoard
        active={props.xIsNext}
        class=" red"
        team="RED"
      />
    </div>
  );
}

const TeamBoard = (props) => {
  let clases = "team-board";
  if(props.active) clases += props.class;

  return(
    <div className={clases}>
      {props.team}
    </div>


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
        play={this.props.play}
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
    sfx.play(merc[i]);
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
      <div className="aplicacion">
      <div className="game">
          <Board
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
            linea={linea}
            play={this.play}
          />
        <div className="titulos">
          <div className="main">TIC TAC TOE</div>
          <div className="sadjoke">THE CLOSEST THING TO A TEAM FORTRESS 2 UPDATE SO FAR</div>
        </div>
      </div>
        <div> {/*className="game-info"*/}
          <ScoreBoard
            xIsNext={this.state.xIsNext}
        />
        {/*<div>{status}</div>
          <ol>{moves}</ol>*/}
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