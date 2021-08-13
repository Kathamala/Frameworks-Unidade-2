<script>
    import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
    import List from "../components/List.svelte";
</script>
  
<Meta
    title="List"
    component={ List }
/>

<Template let:args>
    <List {...args}/>
</Template>

<Story
    name="Segue o relator"
/>
