import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const questionId = new UniqueEntityId('question-1')
    await inMemoryAnswersRepository.create(makeAnswer({ questionId }))
    await inMemoryAnswersRepository.create(makeAnswer({ questionId }))
    await inMemoryAnswersRepository.create(makeAnswer({ questionId }))

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    const questionId = new UniqueEntityId('question-1')

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(makeAnswer({ questionId }))
    }

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
