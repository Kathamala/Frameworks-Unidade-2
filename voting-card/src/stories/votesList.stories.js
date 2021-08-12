import React from 'react';
import VotesList from '../components/VotesList';
import votes from '../components/votes.json'

//👇 This default export determines where your story goes in the story list
export default {
  title: 'VotesList',
  component: VotesList
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <VotesList {...args} />;

export const FirstStory = Template.bind({});

FirstStory.storyName = 'VotingList';
FirstStory.args = {
    votes: votes
};