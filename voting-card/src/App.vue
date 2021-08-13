<template>
  <div id="app">
    <Form/>
  </div>
</template>

<script>
  //import Card from './components/voting-card.vue'
  import Form from './components/voting-form.vue'
  //import List from './components/voting-list.vue'

  /*
      <Card
      :title="title"
      :state="state"
      :votes="votes"
    ></Card>
  */

  export default {
    name: 'App',
    data: () => ({
    }),
    /*
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
    }),*/
    components: {
      //Card
      Form
      //List
    }
  }
</script>

<style>

</style>
