import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account-controller'
import { CreateQuestionController } from './controllers/create-question-controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions-controller'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [CreateQuestionUseCase, FetchRecentQuestionsUseCase],
})
export class HttpModule {}
