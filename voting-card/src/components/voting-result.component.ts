import { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core'

@Component({
  selector: 'result',
  template:  `
    <div *ngFor="let option of votes; index as i">
        {{i+1}}. {{option.option}} - {{option.count}} votes ({{((option.count / total)*100).toFixed(0)}}%)
    </div>
`
})

export class VotingResultComponent implements OnInit {
    @Input() votes: { option: string; count: number; }[] = [];
    public total = 0;

    ngOnInit() {
        for(var i=0; i<this.votes.length; i++){
            this.total += this.votes[i].count;
        }
    }
}