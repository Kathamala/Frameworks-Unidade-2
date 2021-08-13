import { reactive, readonly, computed } from 'vue'

const qstList = reactive([])

export const questions = readonly(qstList)
export const size = computed(() => qstList.length)

export function createQuestion() {
  qstList.push({ statement: '', options: [] })
}

export function updateQuestion(question, index) {
  qstList[index] = question
}

export function deleteQuestion(index) {
  qstList.splice(index, 1)
}
