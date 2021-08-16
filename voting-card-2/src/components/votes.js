import { reactive, readonly, computed } from 'vue'

const vtList = reactive([])

export const votes = readonly(vtList)
export const size = computed(() => vtList.length)

export function createVote() {
  vtList.push(
    { 
      title: '', 
      options: [ {
        text: '',
        count: 0
      },{
        text: '',
        count: 0
      },
    ] 
  })
}

export function updateVote(vote, index) {
  vtList[index] = vote
}

export function deleteVote(index) {
  vtList.splice(index, 1)
}
