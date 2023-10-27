import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      content: 'New notification',
      title: 'First Notification',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.notifications[0].content).toEqual(
      result.value?.notification.content,
    )
  })
})
