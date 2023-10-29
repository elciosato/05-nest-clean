import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth-guard'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const fetchQuestionQuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type FetchQuestionQuerySchema = z.infer<typeof fetchQuestionQuerySchema>

const queryValidationPipe = new ZodValidationPipe(fetchQuestionQuerySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(
    private fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: FetchQuestionQuerySchema,
  ) {
    const result = await this.fetchRecentQuestionsUseCase.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { questions } = result.value

    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
