import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public questionComments: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.questionComments.push(questionComment)
  }

  async findById(id: string) {
    const questionComment = this.questionComments.find(
      (qc) => qc.id.toString() === id,
    )
    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.questionComments
      .filter(
        (questionComment) =>
          questionComment.questionId.toString() === questionId,
      )
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async delete(questionComment: QuestionComment) {
    const questionCommentIndex = this.questionComments.findIndex(
      (qc) => qc.id === questionComment.id,
    )
    if (questionCommentIndex >= 0) {
      this.questionComments.splice(questionCommentIndex, 1)
    }
  }
}
