import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'

interface VoteType {
  title: string
  options: [
            {
                text,
                count
            },
            {
                text,
                count
            }
    ]
}

@Component({
  selector: 'vt-form',
  template: `
    <form #vtForm="ngForm" (ngSubmit)="vtForm.form.valid && onSubmit()">
      <vt-input
        type="textarea"
        label="Título"
        placeholder="Digite o título da votação"
        isRequired="true"
        minlength="3"
        name="title"
        [(value)]="vt.title"
      ></vt-input>

      <vt-input
        type="input"
        label="Opção 1"
        placeholder="Digite a 1ª opção"
        isRequired="true"
        [(value)]="vt.option1"
      ></vt-input>

      <vt-input
        type="input"
        label="Votes 1"
        placeholder="Digite a quantidade de votos da 1ª opção"
        isRequired="true"
        [(value)]="vt.votes1"
      ></vt-input>

      <vt-input
        type="input"
        label="Opção 2"
        placeholder="Digite a 2ª opção"
        isRequired="true"
        [(value)]="vt.option2"
      ></vt-input>

      <vt-input
        type="input"
        label="Votes 2"
        placeholder="Digite a quantidade de votos da 2ª opção"
        isRequired="true"
        [(value)]="vt.votes2"
        ></vt-input>

      <input type="submit" value="Atualizar" />
      <button type="button" (click)="cancel.emit()">Cancelar</button>
    </form>
  `
})
export class VoteFormComponent implements OnInit {
  @Input() vote: VoteType
  @Output() update = new EventEmitter()
  @Output() cancel = new EventEmitter()
  vt

  ngOnInit() {
    const { title, options } = this.vote || {}
    const [ 
        {
          text: option1,
          count: votes1
        },
        {
          text: option2,
          count: votes2
        }
      ] = options || []

    this.vt = {
      title,
      option1,
      option2,
      votes1,
      votes2
    }

    console.log(this.vote);
  }

  onSubmit() {
    const options = [
        {
          text: this.vt.option1,
          count: this.vt.votes1
        },
        {
          text: this.vt.option2,
          count: this.vt.votes2
        },
      ]  

    this.update.emit({
      title: this.vt.title,
      options
    })
  }
}
