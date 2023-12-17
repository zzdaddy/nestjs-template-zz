import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { refreshDto } from './dto/refresh.dto';

@Controller('user')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    let userInfo = await this.authService.login(user);
    if (userInfo) {
      const access_token = this.jwtService.sign(
        {
          user: {
            id: userInfo.id,
            username: userInfo.username,
            // roles: userInfo.roles,
          },
        },
        {
          expiresIn: '1d',
        },
      );
      const refresh_token = this.jwtService.sign(
        {
          userId: userInfo.id,
        },
        {
          expiresIn: '7d',
        },
      );

      res.setHeader('token', access_token);
      return {
        access_token,
        refresh_token,
      };
    }
  }

  @Get('refresh')
  async refresh(@Query() refreshParams: refreshDto) {
    try {
      const data = this.jwtService.verify(refreshParams.refreshToken);

      const user = await this.authService.findUserById(data.userId);

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn: '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn: '7d',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
}
