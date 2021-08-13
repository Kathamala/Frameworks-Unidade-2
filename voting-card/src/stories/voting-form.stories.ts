import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { VoteFormComponent } from 'src/components/voting-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

//👇 This default export determines where your story goes in the story list

export default {
  title: 'Form',
  component: VoteFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        FormsModule, ReactiveFormsModule
      ],
    }),
  ],
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story<VoteFormComponent> = (args: VoteFormComponent) => ({
  props: args,
});

export const FirstStory = Template.bind({});
FirstStory.storyName = "Form 1";
FirstStory.args = {

};

export const SecondStory = Template.bind({});
SecondStory.storyName = "Form 2";
SecondStory.args = {

};