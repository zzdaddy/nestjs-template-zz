import { Controller, Get, Inject, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { setPublicRoute } from './custom/custom.decorator';
@Controller()
export class GatewayController {
  @Inject('ZZSTUDIO_SERVER')
  private serverClient: ClientProxy;
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  getHello(): string {
    return this.gatewayService.getHello();
  }

  @Get('app')
  @setPublicRoute()
  getServerHello(): Observable<any> {
    return this.serverClient.send('hello', 'hello');
  }

  @Post('login')
  @setPublicRoute()
  login(): Observable<any> {
    return this.serverClient.send('login', { username: 1, password: 2 });
  }
}
