
<template>
  <div id="app">
    <List/>
  </div>
</template>

<script>
  //import Card from './components/voting-card.vue'
  //import Form from './components/voting-form.vue'
  import List from './components/voting-list.vue'

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
      //Form
      List
    }
  }
</script>

<style>

</style>

<!--
<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
-->