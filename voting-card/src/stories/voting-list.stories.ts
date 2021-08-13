import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { VoteListComponent } from 'src/components/voting-list.component';
import { VoteFormComponent } from 'src/components/voting-form.component';
import { VotingBoothComponent } from 'src/components/voting-booth.component';
import { VotingResultComponent } from 'src/components/voting-result.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//👇 This default export determines where your story goes in the story list
export default {
  title: 'List',
  component: VoteListComponent,
  decorators: [
    moduleMetadata({
      declarations: [
          VoteFormComponent, 
          VotingBoothComponent,
          VotingResultComponent
        ],
      imports: [
        FormsModule, ReactiveFormsModule
      ],
    }),
  ],
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story<VoteListComponent> = (args: VoteListComponent) => ({
  props: args,
});

export const FirstStory = Template.bind({});
FirstStory.storyName = "VotingList";
FirstStory.args = {
};