import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    name: 'username',
    description: '用户名',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @IsString()
  @Length(2, 10, {
    message: '用户长度为6-10',
  })
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
    message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符',
  })
  username: string;

  @ApiProperty({ name: 'password', description: '密码' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  password: string;
}
