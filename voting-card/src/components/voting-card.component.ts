import { OnInit } from '@angular/core';
import { Component, Input, AfterViewInit } from '@angular/core'
import { VotingBoothComponent } from './voting-booth.component';
import { VotingResultComponent } from './voting-result.component';

@Component({
  selector: 'card',
  template: `
    <div class="votingCard">
        <h1>{{title}}</h1>
        <div *ngIf="state === 'open'; else showResult" >  
            <br/>
            <booth 
                [options]="boothOptions"
                (select)="onSelect($event)"
            >
            </booth>
        </div>

        <ng-template #showResult>
            <result [votes]="votes" ></result>
        </ng-template>
    </div>
  `,
  styles: [
    `
        .votingCard{
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #000;
            background-color: cornflowerblue;
        }
    `
  ]
})

export class VotingCardComponent implements OnInit {
    @Input() title: string | undefined
    @Input() state: string | undefined
    @Input() votes: { option: string; count: number; }[] = []
    boothOptions = ['']

    onSelect(i: any){
        this.votes[i].count++;
        this.state = "closed";
    }    

    ngOnInit() {
        this.boothOptions = this.votes.map(option => (option.option));
    }
}