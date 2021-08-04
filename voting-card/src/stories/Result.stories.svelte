<script>
    import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
    import Result from "../components/Result.svelte";
</script>
  
<Meta
    title="VotingResult"
    component={ Result }
    argTypes={{
        votes: []
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
                option: 'Sim',
                count: 8
            },
            {
                option: 'Não',
                count: 3
            }
        ]
    }}
/>


<Story
    name="Votação 2"
    args={{
        votes: [
            {
                option: 'Sim',
                count: 8
            },
            {
                option: 'Talvez',
                count: 6
            },
            {
                option: 'Não',
                count: 3
            }
        ]
    }}
/>
