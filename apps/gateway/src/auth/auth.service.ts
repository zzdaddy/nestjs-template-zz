import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RedisService } from '../redis/redis.service';
import { RegisterDto } from './dto/resgister.dto';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';

function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}
@Injectable()
export class AuthService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectEntityManager()
  entityManager: EntityManager;

  @Inject()
  private redisService: RedisService;

  private logger = new Logger();

  async register(user: RegisterDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException('用户已存在', 200);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, AuthService);
      return '注册失败';
    }
  }

  async login(user: LoginDto) {
    let loginUser = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });

    if (!loginUser) {
      throw new HttpException('用户名不存在', HttpStatus.OK);
    }

    if (loginUser.password !== md5(user.password)) {
      throw new HttpException('密码错误', HttpStatus.OK);
    }

    // let roles = await this.findRolesByUserId([loginUser.id]);
    return {
      ...loginUser,
      //   roles,
    };
  }

  async findUserById(id: number) {
    return this.entityManager.findOne(User, {
      where: {
        id,
      },
    });
  }
}
