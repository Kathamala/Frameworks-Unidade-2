import List  from '../components/voting-list.vue';

//👇 This default export determines where your story goes in the story list
export default {
  title: 'VotingList',
  component: List
};

//👇 We create a “template” of how args map to rendering

const Template = (args, {argTypes}) => ({
  components: { List },
  setup() {
    return { args };
  },
  template: '<List v-bind="args"/>',
});

export const FirstStory = Template.bind({});
FirstStory.storyName = "VotingList";
FirstStory.args = {
};