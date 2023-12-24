import React, { useState, useImperativeHandle } from 'react';
import { Coordinates } from "./Snake";
import { randomPosition } from './Board';

const Food= React.forwardRef((props,ref) => {
  const [state, setState] = useState(new Coordinates(props.x, props.y));

  function gameOver(){
    let x= randomPosition('x');
    let y= randomPosition('y');
    setState(new Coordinates(x,y));
  }


  function reachedFood(x,y,incSnake,incScore){
    if (state.x===x && state.y===y) {
      incSnake();
      incScore();
      x= randomPosition('x');
      y= randomPosition('y');
      setState(new Coordinates(x,y));
      return true;
    }
    return false;
  }

  useImperativeHandle(ref, () => ({
    reachedFood,
    gameOver,
  }));

  return (
    <div
        className="food"
        style={{ marginLeft: `${state.x}rem`, marginTop: `${state.y}rem` }}
    ></div>
  );

});

export default Food;