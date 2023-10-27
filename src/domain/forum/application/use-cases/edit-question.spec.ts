import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { it } from 'vitest'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
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
      title: 'Title edited',
      content: 'Content edited',
      attachmentIds: ['1', '3'],
    })

    expect(inMemoryQuestionsRepository.questions[0]).toMatchObject({
      title: 'Title edited',
      content: 'Content edited',
    })
    expect(
      inMemoryQuestionsRepository.questions[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryQuestionsRepository.questions[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('should not be able to edit a question from another user', async () => {
    const id = new UniqueEntityId('123456')
    const authorId = new UniqueEntityId('author-1')

    const newQuestion = makeQuestion({ authorId }, id)

    await inMemoryQuestionsRepository.create(newQuestion)

    expect(inMemoryQuestionsRepository.questions).toHaveLength(1)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: id.toString(),
      title: 'Title edited',
      content: 'Content edited',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
