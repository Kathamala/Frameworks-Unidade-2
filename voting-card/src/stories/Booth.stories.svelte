<script>
    import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
    import Booth from "../components/Booth.svelte";
</script>
  
<Meta
    title="VotingBooth"
    component={ Booth }
    argTypes={{
        options: []
    }}
/>

<Template let:args>
    <Booth {...args}/>
</Template>

<Story
    name="Sim/Não"
    args={{
        options: [
            'Sim',
            'Não'
        ]
    }}
/>


<Story
    name="Sim/Não/Talvez"
    args={{
        options: [
            'Sim',
            'Não',
            'Talvez'
        ]
    }}
/>
