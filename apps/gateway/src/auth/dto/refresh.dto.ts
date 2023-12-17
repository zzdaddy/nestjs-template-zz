import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  isString,
} from 'class-validator';

export class refreshDto {
  @ApiProperty({ name: 'refreshToken', description: 'refreshToken' })
  @IsNotEmpty({ message: 'refreshToken不能为空' })
  @IsString()
  refreshToken: string;
}
