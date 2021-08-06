import React, { useState, useEffect } from 'react'
import VotingBooth from './VotingBooth'
import Result from './Result'

export default function VotingCard(props) {

    const boothOptions = props.options.map(option => (option.text));
    const [state, setState] = useState(props.state);

    useEffect(() => {
        if (props.state !== state) {
          setState(props.state)
        }
      }, [props.state])

    function select(optionIndex) {
        setState("closed");
        props.onChose(optionIndex);
    }

    function goBack(){
        props.onReturn();
    }

    if(state === "open"){
        return (
            <div className="votingCard">
                <h2>{ props.title }</h2>
                <VotingBooth choices={ boothOptions } onSelect={ select }/>
            </div>
        )
    } else if(state === "closed"){
        return (
            <div className="votingCard">
                <h2>{ props.title }</h2>
                <Result choices={ props.options }/>
            </div>
        )
    } else{
        return (
            <div>
                <h1>NOT FOUND</h1>
            </div>
        )
    };
}