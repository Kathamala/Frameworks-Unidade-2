import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class VotesService {
  votes: [
    //{ title: '', options: [{text, count: 0}] }
    {
      title: string,
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
  ]

  createVote() {
    if(this.votes == undefined){
        this.votes = [{ title: '', options: [
          {
            text: '',
            count: 0
          },
          {
            text: '',
            count: 0
          }
        ] 
      }
    ]
        return;
    }
    
    this.votes.push({ title: '', options: [          {
      text: '',
      count: 0
    },
    {
      text: '',
      count: 0
    }] })
  }

  updateVote(vote, index) {
    this.votes[index] = vote
  }

  deleteVote(index) {
    this.votes.splice(index, 1)
  }
}
