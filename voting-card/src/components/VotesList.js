import React from 'react'
import BoothForm from './BoothForm'
import VotingCard from './VotingCard';

export default class VotesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      votes: props.votes,
      mode: 'view',
      current: null
    }
  }

  render() {
    if (this.state.mode === 'view') {
      const votes = this.state.votes.map((q, i) => (
        <p key={i}>
          <b>P: </b>
          {q.title}
          <button className="m5" onClick={() => this.openVote(i)}>
            Abre votação
          </button>
          <button className="m5" onClick={() => this.editVote(i)}>
            Edita
          </button>
          <button className="m5" onClick={() => this.removeVote(i)}>
            Remove
          </button>
          <br />
          <b>O: </b>
          {q.options.map((o, i) =>
            i < q.options.length - 1 ? (
              <span key={i}>{o.text} / </span>
            ) : (
              <span key={i}>{o.text}</span>
            )
          )}
        </p>
      ))
      return (
        <>
          <h2>Votações</h2>
          <button onClick={() => this.addVote()}>Nova votação</button>
          {votes}
        </>
      )
    } else if( this.state.mode === 'voteCard'){
        return(
            <VotingCard title={this.state.votes[this.state.current].title} state='open' options={ this.state.votes[this.state.current].options } onChose={this.increaseChoice} goBack={this.cancelChanges}/>
        )
    } else {
      return (
        <BoothForm
          vote={this.state.votes[this.state.current]}
          onUpdate={(vote) => this.updateChanges(vote)}
          onCancel={() => this.cancelChanges()}
        />
      )
    }
  }

  increaseChoice(index){
    this.options[index].votes++
  }

  openVote(index){
    this.setState({ mode: 'voteCard', current: index })
  }

  addVote() {
    const newVote = { statement: '', options: [] }
    const votes = [...this.state.votes, newVote]
    this.setState({
      votes,
      mode: 'add',
      current: votes.length - 1
    })
  }

  editVote(index) {
    this.setState({ mode: 'edit', current: index })
  }

  removeVote(index) {
    const votes = [...this.state.votes]
    votes.splice(index, 1)
    this.setState({ votes })
  }

  updateChanges(vote) {
    const votes = [...this.state.votes]
    votes[this.state.current] = { ...vote }
    this.setState({ mode: 'view', votes })
  }

  cancelChanges() {
    if (this.state.mode === 'add') {
      this.removeVote(this.state.votes.length - 1)
    }
    this.setState({ mode: 'view' })
  }
}
