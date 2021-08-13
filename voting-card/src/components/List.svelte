{#if mode === 'view'}
  <h2>Votações</h2>
  <button on:click={addVote}>Nova votação</button>
  {#each $vList as vote, index}
    <p>
      <b>P: </b> { vote.title }
      <button class="m5" on:click={e=> editVote(index)}>Edita</button>
      <button class="m5" on:click={e=> removeVote(index)}>Remove</button>
      <br />
      <b>R: </b>
      {#each vote.options as o, i}
        <span>
          { o.text }
          {#if i < vote.options.length - 1} <span>/ </span>
          {/if}
        </span>
      {/each}
      <button class="m5" on:click={e=> openVote(index)}>Abre a votação</button>
    </p>
  {/each}
{:else if mode === 'voteCard'}
    <Card title={$vList[current].title} state='open' votes={$vList[current].options}/>
{:else}
<Form votation={$vList[current]} on:update={updateChanges} on:cancel={cancelChanges} />
{/if}

<script>
  import {
    voteList,
    createVoteList
  } from './votes'
  import Form from './Form.svelte'
  import Card from './Card.svelte'

  let mode = 'view'
  let current = null

  let vList = createVoteList()

  function addVote() {
    mode = 'add'
    vList.create()
    
    current = $vList.length - 1
  }

  function openVote(index){
    mode = 'voteCard'
    current = index
  }

  function editVote(index) {
    current = index
    mode = 'edit'
  }

  function removeVote(index) {
    vList.remove(index)
  }

  function updateChanges({ detail }) {
    vList.change(detail, current)
    mode = 'view'
  }

  function cancelChanges() {
    if (mode === 'add') {
      removeVote($vList.length - 1)
    }
    mode = 'view'
  }
</script>
