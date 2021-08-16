<template>
  <form @submit.prevent="onSubmit">
    <h2>Edita votação</h2>
    <Input
      type="textarea"
      label="Título"
      v-model="vt.title"
      placeholder="Digite o título da votação"
      isRequired="true"
      :error="errors['title']"
      @input="touched['title'] = true"
      @blur="checkField('title')"
    />
    <Input
      label="Opção 1"
      v-model="vt.option1"
      placeholder="Digite a 1ª opção"
      isRequired="true"
      :error="errors['option1']"
      @input="touched['option1'] = true"
      @blur="checkField('option1')"
    />
    <Input
      label="Votes 1"
      v-model="vt.votes1"
      placeholder="Digite a quantidade de votos da 1ª opção"
      isRequired="true"
      :error="errors['votes1']"
      @input="touched['votes1'] = true"
      @blur="checkField('votes1')"
    />    
    <Input
      label="Opção 2"
      v-model="vt.option2"
      placeholder="Digite a 2ª opção"
      isRequired="true"
      :error="errors['option2']"
      @input="touched['option2'] = true"
      @blur="checkField('option2')"
    />
    <Input
      label="Votes 2"
      v-model="vt.votes2"
      placeholder="Digite a quantidade de votos da 2ª opção"
      isRequired="true"
      :error="errors['votes2']"
      @input="touched['votes2'] = true"
      @blur="checkField('votes2')"
    />      
    <input type="submit" value="Atualizar" />
    <button @click="$emit('cancel')" type="button">Cancelar</button>
  </form>
</template>

<script>
import Input from './Input.vue'
import { minLengthValidation, requiredIsANumber, requiredValidation } from './validations'

const validate = {
  title: (value) => minLengthValidation(3, value),
  option1: requiredValidation,
  option2: requiredValidation,
  votes1: requiredIsANumber,
  votes2: requiredIsANumber
}

export default {
  components: { Input },
  props: ['vote'],
  data() {
    const { title, options } = this.vote || {}
    //const [option1, option2, votes1, votes2] = options || []

    const [
      {
        text: option1, 
        count: votes1,
      }, 
      {
        text: option2,
        count: votes2
      }
      ] = options || []
    return {
      vt: { title, option1, option2, votes1, votes2 },
      errors: {},
      touched: {}
    }
  },
  methods: {
    checkField(name) {
      if(this.vt[name] === undefined){
        this.vt[name] = ''
      }
      const value = this.vt[name]
      const error = validate[name] ? validate[name](value) : null
      const nameError = this.touched[name] ? error : null
      this.errors[name] = nameError
    },
    onSubmit() {
      Object.keys(this.vt).forEach((field) => {
        this.touched[field] = true
        this.checkField(field)
      })
      const errorsIsEmpty = !Object.values(this.errors).some((v) => v)
      if (errorsIsEmpty) {
        const options = [
          {
            text: this.vt.option1,
            count: this.vt.votes1
          },
          {
            text: this.vt.option2,
            count: this.vt.votes2
          }          
        ].filter((o) => o && o.text.trim() !== '')
        this.$emit('update', {
          title: this.vt.title,
          options
        })
      }
    }
  }
}
</script>

<style scoped>
.form-item {
  display: flex;
  margin-bottom: 1.7rem;
}
</style>