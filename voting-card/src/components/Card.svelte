<div class="votingCard">
    <h1>{ title }</h1>
    <br/>
    {#if state === "open"}
        <Booth 
            options={ boothOptions }
            on:selected={onSelect}
        />
    {:else if state === "closed"}
        <Result {votes}/>
    {:else}
        <h1>Not found</h1>
    {/if}
</div>

<script>
    import Booth from './Booth.svelte'
    import Result from './Result.svelte'

    export let title
    export let state
    export let votes
    const boothOptions = votes.map(option => (option.option))

    function onSelect(event){
        state = "closed"
        votes[event.detail].count++;
    }

</script>

<style>
    .votingCard{
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #000;
        background-color: cornflowerblue;
    }
</style>