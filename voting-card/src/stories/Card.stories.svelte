<script>
    import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
    import Card from "../components/Card.svelte";
</script>
  
<Meta
    title="VotingCard"
    component={ Card }
    argTypes={{
        title: '',
        state: { control: {
            type: 'radio',
            options: ['open', 'closed']
        } },
        votes: []
    }}
/>

<Template let:args>
    <Card {...args}/>
</Template>

<Story
    name="Segue o relator"
    args={{
        title: "Segue o relator?",
        state: "open",
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
    name="Continuamos amanhã"
    args={{
        title: "Continuamos amanhã?",
        state: "closed",
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
