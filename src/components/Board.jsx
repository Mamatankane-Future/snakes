import React, { useRef, useState, useEffect} from "react";
import Snake from "./Snake.jsx";
import Food from "./Food.jsx";
import arrow from "./arrow-up.png"
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export function randomPosition(letter) {
  if (letter==='x'){
    return Math.floor(Math.random() * 48);
  }
  return Math.floor(Math.random() * 28);
}


var interval;

function Board() {
  const snakeRef = useRef(null);
  const foodRef= useRef(null);

  let [score, setScore]= useState(0);
  let [newGame, setGame]= useState(true);
  let [speed, setSpeed]= useState(5);
  const [showA, setShowA] = useState(false);

  const toggleShowA = () => setShowA(!showA);

  function handleKeyDown(event){
    switch (event.key) {
      case 'ArrowUp':
        changeDirection('u');
        break;
      case 'ArrowDown':
        changeDirection('d');
        break;
      case 'ArrowLeft':
        changeDirection('l');
        break;
      case 'ArrowRight':
        changeDirection('r');
        break;
      case ' ':
        pause();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  
  function incScore(){
    let newScore= score+1*speed;
    setScore(newScore);
  }


  function pause(){
    clearInterval(interval);
    interval=undefined;
  }

  function gameOver(){
    pause();
    snakeRef.current.gameOver();
    foodRef.current.gameOver();
    toggleShowA();
    setGame(true);
}

  function changeDirection(direction){
    if (snakeRef.current.currentDirection()===direction &&interval!==undefined) return;
    if (snakeRef.current.currentDirection()==='u' && direction==='d') return;
    if (snakeRef.current.currentDirection()==='d' && direction==='u') return;
    if (snakeRef.current.currentDirection()==='l' && direction==='r') return;
    if (snakeRef.current.currentDirection()==='r' && direction==='l') return;
    clearInterval(interval);
    if (newGame){
      setScore(0);
      setGame(false);
      setShowA(false);
    }
    let coord= snakeRef.current.changeState(direction);
    if (coord===null) {
      gameOver();
      return;
    }
    setTimeout(()=>{
      foodRef.current.reachedFood(coord.x, coord.y,snakeRef.current.incState,incScore);
      moveSnake();
    },10);
  }

  function changeSpeed(){
    let speed = document.getElementById('speed').value;
    setSpeed(speed);
  }

  function moveSnake(){
    
    interval= setInterval(()=>{
      let coord= snakeRef.current.changeState();
      if (coord===null){
        gameOver();
        return;
      }
      foodRef.current.reachedFood(coord.x, coord.y,snakeRef.current.incState,incScore);
    }, 500/speed);
  }

  return (
    <div className="game" id="game">
      <div className="board">
        <Food x={randomPosition('x')} y={randomPosition('y')} ref={foodRef}/>
        <Snake x={randomPosition('x')} y={randomPosition('y')} ref={snakeRef} />
      </div>
      <div className="right">
      <Toast show={showA} onClose={toggleShowA}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto"></strong>
          </Toast.Header>
          <Toast.Body>Game over!</Toast.Body>
        </Toast>
        <div className="buttons">
          <div className="score">Score: {score}</div>
          <Button variant="dark" onClick={pause}>Pause</Button>
          <img  src={arrow} alt="arrow" onClick={()=>{changeDirection('u')}}/>
          <div>
            <img  src={arrow} alt="arrow" style={{ transform: 'rotate(270deg)' }}  onClick={()=>{changeDirection('l')}} />
            <img  src={arrow} alt="arrow" style={{ transform: 'rotate(90deg)' }}  onClick={()=>{changeDirection('r')}} />
          </div>
          <img  src={arrow} alt="arrow" style={{ transform: 'rotate(180deg)' }} onClick={()=>{changeDirection('d')}}/>
        </div>
        <div className="range">
          <input id='speed' type="range" step={1} min={1} max={10} value={speed} onChange={changeSpeed}/>
        </div>
      </div>
    </div>
  );
}
export default Board;
