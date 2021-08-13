<script>
    import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
    import Result from "../components/Result.svelte";
</script>
  
<Meta
    title="VotingResult"
    component={ Result }
    argTypes={{
        options: []
    }}
/>

<Template let:args>
    <Result {...args}/>
</Template>

<Story
    name="Votação 1"
    args={{
        votes: [
            {
                text: 'Sim',
                votes: 8
            },
            {
                text: 'Não',
                votes: 3
            }
        ]
    }}
/>


<Story
    name="Votação 2"
    args={{
        votes: [
            {
                text: 'Sim',
                votes: 8
            },
            {
                text: 'Talvez',
                votes: 6
            },
            {
                text: 'Não',
                votes: 3
            }
        ]
    }}
/>
