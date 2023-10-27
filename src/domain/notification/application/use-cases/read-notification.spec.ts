import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const newNotification = makeNotification()

    await inMemoryNotificationsRepository.create(newNotification)

    expect(inMemoryNotificationsRepository.notifications).toHaveLength(1)

    const result = await sut.execute({
      recipientId: newNotification.recipientId.toString(),
      notificationId: newNotification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.notifications[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to read a notification from another recipient', async () => {
    const id = new UniqueEntityId('123456')
    const recipientId = new UniqueEntityId('recipient-1')

    const newNotification = makeNotification({ recipientId }, id)

    await inMemoryNotificationsRepository.create(newNotification)

    expect(inMemoryNotificationsRepository.notifications).toHaveLength(1)

    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: id.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
