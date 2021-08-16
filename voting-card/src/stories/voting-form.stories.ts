import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { VoteFormComponent } from 'src/components/voting-form.component';
import { FormsModule } from '@angular/forms'
import { InputComponent } from 'src/components/input.component'
//👇 This default export determines where your story goes in the story list

export default {
  title: 'Form',
  component: VoteFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [InputComponent],
      imports: [
        FormsModule
      ],
    }),
  ]
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story<VoteFormComponent> = (args: VoteFormComponent) => ({
  props: args,
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