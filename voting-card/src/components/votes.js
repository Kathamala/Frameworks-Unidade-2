import { writable } from 'svelte/store'

export const voteList = writable([])

export function createVoteList() {
  const { subscribe, update } = writable([])

  function create() {
    const newVote = { 
      title: '', 
      options: [    {
        text: '',
        votes: 0
    }, 
    {   
        text: '',
        votes: 0
    }] 
  }
    update((list) => [...list, newVote])
  }

  function change(vote, index) {
    update((list) => [
      ...list.slice(0, index),
      vote,
      ...list.slice(index + 1)
    ])
  }

  function remove(index) {
    update((list) => [
      ...list.slice(0, index),
      ...list.slice(index + 1)
    ])
  }

  return { subscribe, create, change, remove }
}
