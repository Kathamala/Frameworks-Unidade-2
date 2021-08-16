<template>
  <div v-if="mode === 'view'">
    <h2>Votações</h2>
    <button @click="addVote">Nova votação</button>
    <p v-for="(vote, i) in votes" :key="i">
      <b>P: </b> {{ vote.title }}
      <button className="m5" @click="editVote(i)">Edita</button>
      <button className="m5" @click="removeVote(i)">Remove</button>
      <button className="m5" @click="openVote(i)">Abrir votação</button>
      <br />
      <b>R: </b>
      <span v-for="(o, i) in vote.options" :key="i">
        {{ o.text }}
        <span v-if="i < vote.options.length - 1">/ </span>
      </span>
    </p>
  </div>
  <div v-else-if="mode === 'voteCard'">
    <Card
      :title="votes[current].title"
      :state="'open'"
      :votes="votes[current].options"
    />
  </div>  
  <div v-else>
    <VoteForm
      :vote="votes[current]"
      @update="updateChanges"
      @cancel="cancelChanges"
    />
  </div>
</template>

<script>
import VoteForm from './voting-form.vue'
import Card from './voting-card.vue'
import { ref } from 'vue'

import {
  votes,
  size,
  createVote,
  updateVote,
  deleteVote
} from './votes'

export default {
  components: { VoteForm, Card },
  setup() {
    const mode = ref('view')
    const current = ref(0)

    const openVote = (index) => {
      mode.value = 'voteCard'
      current.value = index
    }

    const addVote = () => {
      createVote()
      mode.value = 'add'
      current.value = size.value - 1
    }

    const updateChanges = (vote) => {
      updateVote(vote, current.value)
      mode.value = 'view'
    }

    const editVote = (index) => {
      current.value = index
      mode.value = 'edit'
    }

    const removeVote = (index) => {
      deleteVote(index)
    }

    const cancelChanges = () => {
      if (mode.value === 'add') {
        deleteVote(size.value - 1)
      }
      mode.value = 'view'
    }

    return {
      mode,
      votes,
      current,
      addVote,
      openVote,
      updateChanges,
      editVote,
      removeVote,
      cancelChanges
    }
  }
}
</script>
