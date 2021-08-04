import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { VotingCardComponent } from '../components/voting-card.component'
import { VotingBoothComponent } from 'src/components/voting-booth.component';
import { VotingResultComponent } from 'src/components/voting-result.component';

@NgModule({
  declarations: [
    AppComponent, VotingCardComponent, VotingBoothComponent, VotingResultComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
