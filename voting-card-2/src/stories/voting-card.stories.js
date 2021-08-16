import Card  from '../components/voting-card.vue';

//👇 This default export determines where your story goes in the story list
export default {
  title: 'VotingCard',
  component: Card,
  argTypes: {
    state: {
      options: ['open', 'closed'],
      control: {type: 'radio'},
    }
  }
};

//👇 We create a “template” of how args map to rendering

const Template = (args, {argTypes}) => ({
  components: { Card },
  setup() {
    return { args };
  },
  template: '<Card v-bind="args"/>',
});

export const FirstStory = Template.bind({});
FirstStory.storyName = "Segue o relator";
FirstStory.args = {
    title: "Segue o relator?",
    state: "open",
    votes: [
        {
          "text": "Sim",
          "count": 8
        },
        {
          "text": "Não",
          "count": 3
        }
      ]
};

export const SecondStory = Template.bind({});
SecondStory.storyName = "Continuamos amanhã";
SecondStory.args = {
    title: "Continuamos amanhã?",
    state: "closed",
    votes: [
        {
            "text": "Sim",
            "count": 8
        },
        {
            "text": "Talvez",
            "count": 6
        },
        {
            "text": "Não",
            "count": 3
        }
      ]
};