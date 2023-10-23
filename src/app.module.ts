import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account-controller'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { CreateQuestionController } from './controllers/create-question-controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [CreateAccountController, CreateQuestionController],
  providers: [PrismaService],
})
export class AppModule {}
