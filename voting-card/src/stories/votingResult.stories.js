import React from 'react';
import '../components/styles.css'

import Result from '../components/Result';

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

function select(){
    return;
}

//👇 This default export determines where your story goes in the story list
export default {
  title: 'Result',
  component: Result,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <Result {...args} />;

export const FirstStory = Template.bind({});
export const SecondStory = Template.bind({});

FirstStory.storyName = "Votação 1";
FirstStory.args = {
    choices: options.slice(0, 2)
};

SecondStory.storyName = "Votação 2";
SecondStory.args = {
    choices: options.slice(0, 3)
};