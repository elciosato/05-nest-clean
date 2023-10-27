import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question.comment'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a comment on question', async () => {
    const newQuestionComment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    expect(inMemoryQuestionCommentsRepository.questionComments).toHaveLength(1)

    await sut.execute({
      authorId: newQuestionComment.authorId.toString(),
      questionCommentId: newQuestionComment.id.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.questionComments).toHaveLength(0)
  })

  it('should not be able to delete a question comment from another author', async () => {
    const newQuestionComment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    expect(inMemoryQuestionCommentsRepository.questionComments).toHaveLength(1)

    const result = await sut.execute({
      authorId: 'author',
      questionCommentId: newQuestionComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
