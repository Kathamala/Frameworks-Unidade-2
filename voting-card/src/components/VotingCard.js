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
        console.log(optionIndex);
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
    }
}

















/*
export default function VotingCard(props) {
    var initVotes = [];
    for(var i=0; i<props.options.choices.length; i++){
        initVotes[i] = 0;
    }
    const [votes, setVotes] = useState(initVotes);
    const [state, setState] = useState(props.state);

    function select(optionIndex) {
        var tempVotes = votes;
        tempVotes[optionIndex]++;
        setVotes(tempVotes);
        setState("closed");
        console.log(votes);
    }

    function voteAgain(){
        setState("open");
    }

    const title = props.title;

    if(state === "open"){
        return (
            <div className="votingCard">
                <h2>{ title }</h2>
                <br/><br/>
                <VotingBooth choices={ props.options.choices } onSelect={ select }/>
            </div>
        )
    } else if(state === "closed"){
        return (
            <div className="votingCard">
                <h2>{ title }</h2>
                <Result choices={ props.options.choices } votes={ votes }/>
                <button onClick= { voteAgain }>Vote again</button>
            </div>
        )
    } else{
        return (
            <div>
                <h1>NOT FOUND</h1>
            </div>
        )
    }
}*/