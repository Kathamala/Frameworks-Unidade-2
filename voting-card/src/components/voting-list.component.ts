import { Component } from '@angular/core'
import { VotesService } from './voting-list.service'

@Component({
  selector: 'vt-list',
  template: `
    <div *ngIf="mode === 'view'">
      <h2>Votações</h2>
      <button (click)="addVote()">Nova votação</button>
      <p *ngFor="let vote of vtService.votes; index as i">
        <b>P: </b> {{ vote.title }}
        <button className="m5" (click)="editVote(i)">
          Edita
        </button>
        <button className="m5" (click)="removeVote(i)">
          Remove
        </button>
        <br />
        <b>R: </b>
        <span *ngFor="let o of vote.options; index as i">
          {{ o.text }}
          <span *ngIf="i < vote.options.length - 1">/ </span>
        </span>
        <button (click)="openVote(i)">Abre votação</button>
      </p>
    </div>

    <div *ngIf="mode === 'voteCard'">
      <card
        [title]="vtService.votes[current].title"
        [state]="'open'"
        [votes]="vtService.votes[current].options"
      ></card>
    </div>    

    <div *ngIf="mode !== 'view' && mode !== 'voteCard'">
      <vt-form
        [vote]="vtService.votes[current]"
        (update)="updateChanges($event)"
        (cancel)="cancelChanges($event)"
      ></vt-form>
    </div>
  `
})
export class VoteListComponent {
  mode = 'view'
  current = 0

  constructor(public vtService: VotesService) {}

  addVote() {
    this.mode = 'add'
    this.vtService.createVote()
    this.current = this.vtService.votes.length - 1
  }

  openVote(index){
    this.mode = 'voteCard'
    this.current = index
  }

  editVote(index) {
    this.current = index
    this.mode = 'edit'
  }

  removeVote(index) {
    this.vtService.deleteVote(index)
  }

  updateChanges(vote) {
    this.vtService.updateVote(vote, this.current)
    this.mode = 'view'
  }

  cancelChanges(vote) {
    if (this.mode === 'add') {
      this.vtService.deleteVote(this.vtService.votes.length - 1)
    }
    this.mode = 'view'
  }
}
