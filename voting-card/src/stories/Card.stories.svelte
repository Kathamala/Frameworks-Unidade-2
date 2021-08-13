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
    name="Continuamos amanhã"
    args={{
        title: "Continuamos amanhã?",
        state: "closed",
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
