import React from 'react'
const Square = ({ val, chooseSquare }) => {
  return (
    <div onClick={chooseSquare} className="square">
      {val}
    </div>
  )
}

export default Square
