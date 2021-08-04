import Result  from '../components/voting-result.vue';

//👇 This default export determines where your story goes in the story list
export default {
  title: 'Result',
  component: Result
};

//👇 We create a “template” of how args map to rendering

const Template = (args, {argTypes}) => ({
  components: { Result },
  props: Object.keys(argTypes),
  template: '<Result v-bind="$props"/>',
});

export const FirstStory = Template.bind({});
FirstStory.storyName = "Votação 1";
FirstStory.args = {
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
SecondStory.storyName = "Votação 2";
SecondStory.args = {
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