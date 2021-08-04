import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'booth',
  template: `
    <button class="choice" *ngFor="let option of options; index as i" (click)="select.emit(i)">
        {{ option }}
    </button>
  `,
  styles:[
    `
        .choice{
            margin: 10px;
        }
`
  ]
})

export class VotingBoothComponent {
    @Input() options: string[] | undefined
    @Output() select = new EventEmitter()
}