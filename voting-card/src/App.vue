<template>
  <div id="app">
    <Card
      :title="title"
      :state="state"
      :votes="votes"
    ></Card>
  </div>
</template>

<script>
  import Card from './components/voting-card.vue'

  export default {
    name: 'App',
    data: () => ({
      title: "Segue o relator?",
      state: "open",
      votes: [
        {
          "option": "Sim",
          "count": 8
        },
        {
          "option": "Não",
          "count": 3
        }
      ]
    }),
    components: {
      Card
    }
  }
</script>

<style>

</style>
