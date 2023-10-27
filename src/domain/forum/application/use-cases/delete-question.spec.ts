import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to delete a question', async () => {
    const id = new UniqueEntityId('123456')
    const authorId = new UniqueEntityId('author-1')

    const newQuestion = makeQuestion({ authorId }, id)

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.questionAttachments.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    expect(inMemoryQuestionsRepository.questions).toHaveLength(1)

    await sut.execute({
      authorId: authorId.toString(),
      questionId: id.toString(),
    })

    expect(inMemoryQuestionsRepository.questions).toHaveLength(0)
    expect(
      inMemoryQuestionAttachmentsRepository.questionAttachments,
    ).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const id = new UniqueEntityId('123456')
    const authorId = new UniqueEntityId('author-1')

    const newQuestion = makeQuestion({ authorId }, id)

    await inMemoryQuestionsRepository.create(newQuestion)

    expect(inMemoryQuestionsRepository.questions).toHaveLength(1)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
