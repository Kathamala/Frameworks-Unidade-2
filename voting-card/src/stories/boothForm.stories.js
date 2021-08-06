import React from 'react';
import BoothForm from '../components/BoothForm';
import '../components/styles.css'

//👇 This default export determines where your story goes in the story list
export default {
  title: 'BoothForm',
  component: BoothForm
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <BoothForm />;

export const FirstStory = Template.bind({});

FirstStory.storyName = 'Formulário';
FirstStory.args = {
};