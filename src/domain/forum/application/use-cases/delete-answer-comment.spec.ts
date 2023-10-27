import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { describe } from 'vitest'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a comment on answer', async () => {
    const newAnswerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    expect(inMemoryAnswerCommentsRepository.answerComments).toHaveLength(1)

    await sut.execute({
      authorId: newAnswerComment.authorId.toString(),
      answerCommentId: newAnswerComment.id.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.answerComments).toHaveLength(0)
  })

  it('should not be able to delete a answer comment from another author', async () => {
    const newAnswerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    expect(inMemoryAnswerCommentsRepository.answerComments).toHaveLength(1)

    const result = await sut.execute({
      authorId: 'author',
      answerCommentId: newAnswerComment.id.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(NotAllowedError)
  })
})
