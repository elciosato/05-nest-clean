import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { expect } from 'vitest'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete a answer', async () => {
    const id = new UniqueEntityId('123456')
    const authorId = new UniqueEntityId('author-1')

    const newAnswer = makeAnswer({ authorId }, id)

    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.answerAttachments.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )
    expect(inMemoryAnswersRepository.answers).toHaveLength(1)

    await sut.execute({
      authorId: authorId.toString(),
      answerId: id.toString(),
    })

    expect(inMemoryAnswersRepository.answers).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.answerAttachments).toHaveLength(
      0,
    )
  })

  it('should not be able to delete a answer from another user', async () => {
    const id = new UniqueEntityId('123456')
    const authorId = new UniqueEntityId('author-1')

    const newAnswer = makeAnswer({ authorId }, id)

    await inMemoryAnswersRepository.create(newAnswer)

    expect(inMemoryAnswersRepository.answers).toHaveLength(1)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: id.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
