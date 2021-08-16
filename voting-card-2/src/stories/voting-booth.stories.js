import Booth  from '../components/voting-booth.vue';

//👇 This default export determines where your story goes in the story list
export default {
  title: 'Booth',
  component: Booth
};

//👇 We create a “template” of how args map to rendering

const Template = (args, {argTypes}) => ({
  components: { Booth },
  setup() {
    return { args };
  },
  template: '<Booth v-bind="args"/>',
});

export const FirstStory = Template.bind({});
FirstStory.storyName = "Sim/Não"
FirstStory.args = {
    options: ['Sim', 'Não']
};

export const SecondStory = Template.bind({});
SecondStory.storyName = "Sim/Não/Talvez"
SecondStory.args = {
    options: ['Sim', 'Não', 'Talvez']
};