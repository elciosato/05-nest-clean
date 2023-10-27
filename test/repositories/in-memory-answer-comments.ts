import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public answerComments: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.answerComments.push(answerComment)
  }

  async findById(id: string) {
    const answerComment = this.answerComments.find(
      (ac) => ac.id.toString() === id,
    )
    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.answerComments
      .filter((answerComment) => answerComment.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async delete(answerComment: AnswerComment) {
    const answerCommentIndex = this.answerComments.findIndex(
      (ac) => ac.id === answerComment.id,
    )
    if (answerCommentIndex >= 0) {
      this.answerComments.splice(answerCommentIndex, 1)
    }
  }
}
