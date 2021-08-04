import logo from './logo.svg';
import './App.css';
import VotingCard from './components/VotingCard';
import React, { useState } from 'react';
import './components/styles.css'

const options = [
  {
    text: "Sim",
    votes: 5
  },
  {
    text: "Não",
    votes: 2
  }
]

function increaseChoice(index){
  options[index].votes++;
}

function App() {

  return (
    <div>
      <VotingCard title="Segue o relator?" state="open" options={ options } onChose={ increaseChoice }/>
    </div>
    
  );
}

export default App;