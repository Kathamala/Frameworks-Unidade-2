{#each votes as option, index (option)}
    <div>
        { index+1 }. {option.text} - { option.votes } votes ({ ((option.votes/total)*100).toFixed(0) }%)
    </div>
{/each}

<script>
    export let votes
    let total = 0

    for(var i=0; i<votes.length; i++){
        total += parseInt(votes[i].votes)
    }

</script>