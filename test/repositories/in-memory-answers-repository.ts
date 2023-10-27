import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer) {
    this.answers.push(answer)

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findById(id: string) {
    const answer = this.answers.find((answer) => answer.id.toString() === id)
    if (!answer) {
      return null
    }
    return answer
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.answers
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.answers.findIndex((a) => a.id === answer.id)

    if (answerIndex >= 0) {
      this.answers.splice(answerIndex, 1)
    }

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async save(answer: Answer) {
    const answerIndex = this.answers.findIndex((q) => q.id === answer.id)

    if (answerIndex >= 0) {
      this.answers[answerIndex] = answer

      DomainEvents.dispatchEventsForAggregate(answer.id)
    }
  }
}
