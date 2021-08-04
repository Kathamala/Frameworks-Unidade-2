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
  props: Object.keys(argTypes),
  template: '<Card v-bind="$props"/>',
});

export const FirstStory = Template.bind({});
FirstStory.storyName = "Segue o relator";
FirstStory.args = {
    title: "Segue o relator?",
    state: "open",
    votes: [
        {
          "option": "Sim",
          "count": 8
        },
        {
          "option": "Não",
          "count": 3
        }
      ]
};

export const SecondStory = Template.bind({});
SecondStory.storyName = "Continuamos amanhã";
SecondStory.args = {
    title: "Segue o relator?",
    state: "closed",
    votes: [
        {
            "option": "Sim",
            "count": 8
        },
        {
            "option": "Talvez",
            "count": 6
        },
        {
            "option": "Não",
            "count": 3
        }
      ]
};