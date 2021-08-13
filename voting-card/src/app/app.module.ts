import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { VotingCardComponent } from '../components/voting-card.component'
import { VotingBoothComponent } from 'src/components/voting-booth.component';
import { VotingResultComponent } from 'src/components/voting-result.component';
import { VoteFormComponent } from 'src/components/voting-form.component';
import { VoteListComponent } from 'src/components/voting-list.component';
import { InputComponent } from 'src/components/input.component'

@NgModule({
  declarations: [
    AppComponent, 
    VotingCardComponent, 
    VotingBoothComponent, 
    VotingResultComponent, 
    VoteFormComponent, 
    VoteListComponent,
    InputComponent
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
