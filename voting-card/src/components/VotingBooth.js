//Opções da votação

import React from 'react'

export default function VotingBooth(props) {

    const choices = props.choices.map((option, index) => (
        <button className="choices" key={option} onClick={() => props.onSelect(index)}>
        {option}
      </button>
    ))
      

    return (
        <div>
            { choices }
        </div>
    )
}