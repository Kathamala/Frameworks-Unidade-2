// YourComponent.stories.js

import React from 'react';
import '../components/styles.css'

import VotingCard from '../components/VotingCard';

const options = [
  {
    text: "Sim",
    votes: 5
  },
  {
    text: "Não",
    votes: 2
  },
  {
    text: "Talvez",
    votes: 6
  }
]

function increaseChoice(index){
  options[index].votes++;
}

//👇 This default export determines where your story goes in the story list
export default {
  title: 'VotingCard',
  component: VotingCard,
  argTypes: {
    state: {
      options: ['open', 'closed'],
      control: {type: 'radio'},
    }
  }
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <VotingCard {...args} />;

export const FirstStory = Template.bind({});
export const SecondStory = Template.bind({});

FirstStory.storyName = "Segue o relator";
FirstStory.args = {
  title: "Segue o relator?",
  state: 'open',
  options: options.slice(0, 2),
  onChose: increaseChoice
};

SecondStory.storyName = "Continuamos amanhã";
SecondStory.args = {
  title: "Continuamos amanhã?",
  state: 'closed',
  options: options.slice(0, 3),
  onChose: increaseChoice
};