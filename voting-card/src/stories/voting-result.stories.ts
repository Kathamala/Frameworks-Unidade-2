import { Meta, Story } from '@storybook/angular';
import { VotingResultComponent } from 'src/components/voting-result.component';

//👇 This default export determines where your story goes in the story list
export default {
  title: 'Result',
  component: VotingResultComponent
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story<VotingResultComponent> = (args: VotingResultComponent) => ({
  props: args,
});

export const FirstStory = Template.bind({});
FirstStory.storyName = "Votação 1";
FirstStory.args = {
    votes:  [
        {
            text: 'Sim',
            count: 8,
        },
        {
            text: 'Não',
            count: 3
        }
    ]
};

export const SecondStory = Template.bind({});
SecondStory.storyName = "Votação 2";
SecondStory.args = {
    votes:  [
        {
            text: 'Sim',
            count: 8,
        },
        {
            text: 'Talvez',
            count: 6
        },
        {
            text: 'Não',
            count: 3
        }
    ]
};