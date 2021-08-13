<template>
  <form @submit.prevent="onSubmit">
    <h2>Edita questão</h2>
    <Input
      type="textarea"
      label="Enunciado"
      v-model="qst.statement"
      placeholder="Digite o enunciado da questão"
      isRequired="true"
      name="statement"
      :error="errors['statement']"
      @input="touched['statement'] = true"
      @blur="checkField('statement')"
    />
    <Input
      label="Opção 1"
      v-model="qst.option1"
      placeholder="Digite a 1ª opção"
      isRequired="true"
      name="option1"
      :error="errors['option1']"
      @input="touched['option1'] = true"
      @blur="checkField('option1')"
    />
    <Input
      label="Opção 2"
      v-model="qst.option2"
      placeholder="Digite a 2ª opção"
      isRequired="true"
      name="option2"
      :error="errors['option2']"
      @input="touched['option2'] = true"
      @blur="checkField('option2')"
    />
    <Input
      label="Opção 3"
      v-model="qst.option3"
      placeholder="Digite a 3ª opção"
      :error="errors['option3']"
      name="option3"
      @input="touched['option3'] = true"
      @blur="checkField('option3')"
    />
    <Input
      label="Opção 4"
      v-model="qst.option4"
      placeholder="Digite a 4ª opção"
      :error="errors['option4']"
      name="option4"
      @input="touched['option4'] = true"
      @blur="checkField('option4')"
    />
    <input type="submit" value="Atualizar" />
    <button @click="$emit('cancel')" type="button">Cancelar</button>
  </form>
</template>

<script>
import Input from './Input.vue'
import { minLengthValidation, requiredValidation } from './validations'

const validate = {
  statement: (value) => minLengthValidation(3, value),
  option1: requiredValidation,
  option2: requiredValidation
}

export default {
  components: { Input },
  props: ['question'],
  data() {
    const { statement, options } = this.question || {}
    const [option1, option2, option3, option4] = options || []
    return {
      qst: { statement, option1, option2, option3, option4 },
      errors: {},
      touched: {}
    }
  },
  methods: {
    checkField(name) {
        console.log(this.qst);
      const value = this.qst[name]
      const error = validate[name] ? validate[name](value) : null
      const nameError = this.touched[name] ? error : null
      this.errors[name] = nameError
    },
    onSubmit() {
      Object.keys(this.qst).forEach((field) => {
        this.touched[field] = true
        this.checkField(field)
      })
      const errorsIsEmpty = !Object.values(this.errors).some((v) => v)
      if (errorsIsEmpty) {
        const options = [
          this.qst.option1,
          this.qst.option2,
          this.qst.option3,
          this.qst.option4
        ].filter((o) => o && o.trim() !== '')
        this.$emit('update', {
          statement: this.qst.statement,
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