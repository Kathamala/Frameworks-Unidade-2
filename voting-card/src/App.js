import './App.css';
import React from 'react';
import './components/styles.css'
import votes from './components/votes.json'

import BoothForm from './components/BoothForm';
import VotesList from './components/VotesList';

function App() {

  return (
    <div>
      <VotesList votes={votes} />
    </div>
    
  );
}

export default App;