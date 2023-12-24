import React, { useState, useImperativeHandle } from 'react';
import { randomPosition } from './Board';

export class Coordinates {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction=direction;
  }
}

const Snake = React.forwardRef((props, ref) => {

  const [state, setState] = useState([new Coordinates(props.x, props.y,randomDirection())]);
  
  function randomDirection(){
    let d= Math.floor(Math.random() * 4);
    if (d===0) d= 'u';
    else if  (d===1) d='d';
    else if (d===2) d='l';
    else d='r';
    return d;
  }
  function gameOver(){
    let x= randomPosition('x');
    let y= randomPosition('y');
    let d= randomDirection();
    setState([new Coordinates(x,y, d)]);
  }

  function changeState(direction) {
    let coord;
    let firstCoord = state[0];
    if (!direction){
      direction= firstCoord.direction;
    }

    switch (direction) {
        case 'u':
          coord = new Coordinates(firstCoord.x, firstCoord.y - 1, 'u');
          break;
        case 'd':
          coord = new Coordinates(firstCoord.x, firstCoord.y + 1, 'd');
          break;
        case 'l':
          coord = new Coordinates(firstCoord.x - 1, firstCoord.y, 'l');
          break;
        case 'r':
          coord = new Coordinates(firstCoord.x + 1, firstCoord.y, 'r');
          break;
        default:
          return;
      }
    if (coord.x<0 || coord.y<0 || coord.x>49 || coord.y>29) return null;
    let n = state.find((element) => element.x === coord.x && element.y === coord.y);
    if (n) return null;
    let newState= [coord, ...state.slice(0, -1)];
    setState(newState);
    
    return coord;
  }

  function currentDirection(){
    return state[0].direction;
  }

  function incState() {
    let lastCoord = state[state.length - 1];
    let coord;
    switch (lastCoord.direction) {
      case 'u':
        coord = new Coordinates(lastCoord.x, lastCoord.y + 1, 'u');
        break;
      case 'd':
        coord = new Coordinates(lastCoord.x, lastCoord.y - 1, 'd');
        break;
      case 'l':
        coord = new Coordinates(lastCoord.x + 1, lastCoord.y, 'l');
        break;
      case 'r':
        coord = new Coordinates(lastCoord.x - 1, lastCoord.y, 'r');
        break;
      default:
        return;
    }
    let newState= [...state, coord];
    setState(newState);
    
  }

  useImperativeHandle(ref, () => ({
    incState,
    changeState,
    gameOver,
    currentDirection,
  }));

  return (
    <div>
      {state.map((coord, index) => (
        <div
          key={index}
          className="snake"
          style={{
            marginLeft: `${coord.x}rem`,
            marginTop: `${coord.y}rem`,
            ...(index === 0 && {
              transform:
                coord.direction === 'r' ? 'rotate(90deg)' :
                coord.direction === 'd' ? 'rotate(180deg)' :
                coord.direction === 'l' ? 'rotate(270deg)' :
                ''
            })
          }}
        >
          {index === 0 && (
            <div className='eyes'>
              <div className="eye"></div>
              <div className="eye"></div>
            </div>
          )}
        </div>
      ))}
    </div>

  );
});

export default Snake;
