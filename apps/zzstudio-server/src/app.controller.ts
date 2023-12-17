import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('hello')
  getHello(): string {
    return 'hello by zzstudio-server';
  }

  @MessagePattern('login')
  login(): object {
    return {
      access_token: '123456',
      refresh_token: '123456',
    };
  }
}
