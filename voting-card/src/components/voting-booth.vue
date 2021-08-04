<template>
    <div id="booth">
        <button 
            class="choices"
            v-for="(option, index) in options" 
            :key="option"
            @click="$emit('select', index)"
        >
            {{ option }}
        </button>
    </div>
</template>

<script>

    export default {
        props: ['options']
    }

</script>

<style>
    .choices{
        margin: 10px;
    }  
</style>
