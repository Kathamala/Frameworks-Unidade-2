{#each votes as option, index (option)}
    <div>
        { index+1 }. {option.option} - { option.count } votes ({ ((option.count/total)*100).toFixed(0) }%)
    </div>
{/each}

<script>
    export let votes
    let total = 0

    for(var i=0; i<votes.length; i++){
        total += votes[i].count
    }

</script>