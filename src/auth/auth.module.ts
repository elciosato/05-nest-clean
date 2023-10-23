import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { EnvSchema } from 'src/env'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<EnvSchema, true>) {
        console.log(config.get('JWT_SECRET', { infer: true }))

        return {}
      },
    }),
  ],
})
export class AuthModule {}
