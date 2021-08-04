//Resultado da votação

import React from 'react'

export default function Result(props) {
    var totalVotes = 0;
    for(var i=0; i < props.choices.length; i++){
        totalVotes += props.choices[i].votes;
    }

    const results = props.choices.map((choice, index) => (
        <p key={index.toString()}>
          {index + 1}. { choice.text } - { choice.votes } votes ({((choice.votes / (1.0*totalVotes))*100).toFixed(0)}%)
        </p>
      ))

    return (
        <div>
            <h4>Resultado da Votação: </h4>
            <h5>{ results }</h5>
        </div>
    )

}