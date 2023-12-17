import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoginGuard } from './global-guard/login.guard';
import { CommonErrorCatchFilter } from './custom/custom.filter';
import { HttpCommonInterceptor } from './custom/custom.interceptor';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { User } from './auth/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ZZSTUDIO_SERVER',
        transport: Transport.TCP,
        options: {
          port: 7577,
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: 'zzdaddy',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '123456',
          database: 'zzstudio',
          synchronize: true,
          logging: true,
          entities: [User],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
    }),
    AuthModule,
    RedisModule,
  ],
  controllers: [GatewayController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCommonInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CommonErrorCatchFilter,
    },
    GatewayService,
  ],
})
export class GatewayModule {}
