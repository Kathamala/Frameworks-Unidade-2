<template>
    <div id="result">
        <div 
            v-for="(option, index) in votes"
            :key="option.option"
        >
            {{index+1}}. {{option.option}} - {{option.count}} votes ({{((option.count / total)*100).toFixed(0)}}%)
        </div>
    </div>
</template>

<script>
    export default {
        props: ['votes'],
        data: () => ({
            total: 0
        }),
        created: function (){
            for(var i=0; i<this.votes.length; i++){
                this.total += this.votes[i].count;
            }
        }
    }
</script>

<style>

</style>