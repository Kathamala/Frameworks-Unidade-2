import { Meta, Story } from '@storybook/angular';
import { VotingBoothComponent } from '../components/voting-booth.component'

//👇 This default export determines where your story goes in the story list
export default {
  title: 'Booth',
  component: VotingBoothComponent
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story<VotingBoothComponent> = (args: VotingBoothComponent) => ({
  props: args,
});

export const FirstStory = Template.bind({});
FirstStory.storyName = "Sim/Não";
FirstStory.args = {
    options: ['Sim', 'Não']
};

export const SecondStory = Template.bind({});
SecondStory.storyName = "Sim/Não/Talvez";
SecondStory.args = {
    options: ['Sim', 'Não', 'Talvez']
};