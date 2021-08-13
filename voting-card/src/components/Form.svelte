<form on:submit|preventDefault={submit}>
	<h2>Edita votação</h2>
	<Input 
        type="textarea" 
        label="Enunciado" 
        bind:value={vote.title} 
        on:input={touched['title']=true} 
        on:blur={e=> checkField('title')}
        placeholder="Digite o título da votação" 
        isRequired="true" 
        error={errors['title']} />

	<Input 
        label="Opção 1" 
        bind:value={vote.option1} 
        on:input={e=> touched['option1']=true} 
        on:blur={e => checkField('option1')} 
        placeholder="Digite a 1ª opção" 
        isRequired="true" 
        error={errors['option1']} />

	<Input 
        label="Votes 1" 
        bind:value={vote.votes1} 
        on:input={e=> touched['votes1']=true} 
        on:blur={e => checkField('votes1')} 
        placeholder="Digite a quantidade de votos da 1ª opção" 
        error={errors['votes1']}/>  
          
	<Input 
        label="Opção 2" 
        bind:value={vote.option2} 
        on:input={e=> touched['option2']=true} 
        on:blur={e => checkField('option2')} 
        placeholder="Digite a 2ª opção" 
        isRequired="true" 
        error={errors['option2']} />

	<Input 
        label="Votes 2" 
        bind:value={vote.votes2} 
        on:input={e=> touched['votes2']=true} 
        on:blur={e => checkField('votes2')} 
        placeholder="Digite a quantidade de votos da 2ª opção" 
        error={errors['votes2']}/>

	<input type="submit" value="Atualizar">
	<button type="button" on:click={e=> dispatch('cancel')}>Cancelar</button>
</form>

<script>
  import { minLengthValidation, requiredValidation, requiredIsANumber, openOrClosed } from './validations.js'
  import { createEventDispatcher } from 'svelte'
  import Input from './Input.svelte'

  export let votation
  const validate = {
    title: value => minLengthValidation(3, value),
    option1: requiredValidation,
    option2: requiredValidation,
    votes1: requiredIsANumber,
    votes2: requiredIsANumber
  }
  let errors = {}
  let touched = {}
  const dispatch = createEventDispatcher()

  const { title, options } = votation || {}

  const [ 
    {
      text: option1,
      votes: votes1
    },
    {
      text: option2,
      votes: votes2
    }
  ] = options || []
  let vote = { title, option1, option2, votes1, votes2 }

  function checkField(name) {
    errors[name] = ''
    if (validate[name] && touched[name]) {
      const value = vote[name]
      errors[name] = validate[name](value) || ''
    }
  }

  function submit() {
    Object.keys(vote).forEach(field => {
      touched[field] = true
      checkField(field)
    })
    const errorsIsEmpty = !Object.values(errors).some(v => v)
    if (errorsIsEmpty) {
      const allOptions = [
        {
          text: vote.option1,
          votes: vote.votes1
        },
        {
          text: vote.option2,
          votes: vote.votes2
        },
      ]      
      dispatch('update', {
        title: vote.title,
        options: allOptions
      })
    }
  }
</script>
