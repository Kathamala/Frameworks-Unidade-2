import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<card title="Segue o relator?" state="open" [votes]="options" ></card>'
})
export class AppComponent {
  title = 'voting-card';
  options = [
    {
        option: 'Sim',
        count: 8,
    },
    {
        option: 'Não',
        count: 3
    }
]
}

