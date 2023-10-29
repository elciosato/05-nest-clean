import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthenticateController } from '@/infra/http/controllers/authenticate-controller'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtStrategy } from './jwt-strategy'
import { EnvSchema } from '../env'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<EnvSchema, true>) {
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  controllers: [AuthenticateController],
  providers: [PrismaService, JwtStrategy, AuthenticateStudentUseCase],
})
export class AuthModule {}
