import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth-guard'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

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
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: FetchQuestionQuerySchema,
  ) {
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { questions }
  }
}
