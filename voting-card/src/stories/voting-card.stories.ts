import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { VotingBoothComponent } from 'src/components/voting-booth.component';
import { VotingResultComponent } from 'src/components/voting-result.component';
import { VotingCardComponent } from '../components/voting-card.component'

//👇 This default export determines where your story goes in the story list
export default {
  title: 'VotingCard',
  component: VotingCardComponent,
  argTypes: {
    state: {
      options: ['open', 'closed'],
      control: {type: 'radio'}
    }
  },
  decorators: [
    moduleMetadata({
      declarations: [VotingBoothComponent, VotingResultComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story<VotingCardComponent> = (args: VotingCardComponent) => ({
  props: args,
});

export const FirstStory = Template.bind({});
FirstStory.storyName = "Segue o relator"
FirstStory.args = {
  title: "Segue o relator?",
  state: 'open',
  votes:  [
    {
        option: 'Sim',
        count: 8,
    },
    {
        option: 'Não',
        count: 3
    }
]
};

export const SecondStory = Template.bind({});
SecondStory.storyName = "Continuamos amanhã"
SecondStory.args = {
  title: "Continuamos amanhã?",
  state: 'closed',
  votes:  [
    {
        option: 'Sim',
        count: 8,
    },
    {
      option: 'Talvez',
      count: 6,
    },
    {
        option: 'Não',
        count: 3
    }
]
};