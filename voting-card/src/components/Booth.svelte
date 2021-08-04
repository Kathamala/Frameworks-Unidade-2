{#each options as option, index (option)}
    <button class="choices" on:click={dispatcher('selected', index)}>{option}</button>
{/each}

<script>
    import { createEventDispatcher } from 'svelte'

    export let options
    const dispatcher = createEventDispatcher()

</script>

<style>
    .choices{
        margin: 10px;
    }
</style>