import React from 'react';
import '../components/styles.css'

import VotingBooth from '../components/VotingBooth';

const options = ["Sim", "Não", "Talvez"];

function select(){
    return;
}

//👇 This default export determines where your story goes in the story list
export default {
  title: 'VotingBooth',
  component: VotingBooth,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <VotingBooth {...args} />;

export const FirstStory = Template.bind({});
export const SecondStory = Template.bind({});

FirstStory.storyName = 'Sim/Não';
FirstStory.args = {
    choices: options.slice(0, 2),
    onSelect: select
};

SecondStory.storyName = 'Sim/Não/Talvez';
SecondStory.args = {
    choices: options.slice(0, 3),
    onSelect: select
};