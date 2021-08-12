import React from 'react';
import BoothForm from '../components/BoothForm';
import '../components/styles.css'
import votes from '../components/votes.json'

//👇 This default export determines where your story goes in the story list
export default {
  title: 'BoothForm',
  component: BoothForm
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <BoothForm {...args}/>;

export const FirstStory = Template.bind({});
export const SecondStory = Template.bind({});

FirstStory.storyName = 'Formulário 1';
FirstStory.args = {
  vote: votes[0],
  onUpdate: function(){},
  onCancel: function(){}
};

SecondStory.storyName = 'Formulário 2';
SecondStory.args = {
  vote: votes[1],
  onUpdate: function(){},
  onCancel: function(){}
};