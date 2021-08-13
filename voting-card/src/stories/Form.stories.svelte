<script>
    import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
    import Form from "../components/Form.svelte";
</script>
  
<Meta
    title="Form"
    component={ Form }
    argTypes={{
        title: 'Segue o relator?',
        options: [
        ]
    }}
/>

<Template let:args>
    <Form {...args}/>
</Template>

<Story
    name="Segue o relator"
    args={{
        votation: {
            title: "Segue o relator?",
            options: [
            {
                text: 'Sim',
                votes: 8
            },
            {
                text: 'Não',
                votes: 3
            }
            ]  
        }
    }}
/>

<Story
    name="Continuamos amanhã"
    args={{
        votation: {
            title: "Continuamos amanhã?",
            options: [
                {
                    text: 'Sim',
                    votes: 8
                },
                {
                    text: 'Talvez',
                    votes: 6
                }
            ]
        }
    }}
/>
