import Form  from '../components/voting-form.vue';

//👇 This default export determines where your story goes in the story list
export default {
  title: 'VotingForm',
  component: Form
};

//👇 We create a “template” of how args map to rendering

const Template = (args, {argTypes}) => ({
  components: { Form },
  setup() {
    return { args };
  },
  template: '<Form v-bind="args"/>',
});

export const FirstStory = Template.bind({});
FirstStory.storyName = "Form 1";
FirstStory.args = {
  vote: 
    {
      title: 'Segue o relator?',
      options: [
                {
                    text: 'Sim',
                    count: 4
                },
                {
                    text: 'Não',
                    count: 7
                }
        ]
    }
};

export const SecondStory = Template.bind({});
SecondStory.storyName = "Form 2";
SecondStory.args = {
  vote:
    {
      title: 'Continuamos amanhã?',
      options: [
                {
                    text: 'Sim',
                    count: 4
                },
                {
                    text: 'Talvez',
                    count: 8
                }
        ]
    }
};