import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    comment: '姓名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    comment: '昵称',
    nullable: true,
  })
  email: string;

  @Column({
    length: 10,
    comment: '昵称',
    nullable: true,
  })
  nickname: string;

  @Column({
    nullable: true,
    comment: '生日',
  })
  birthday: string;

  @Column({
    nullable: true,
    comment: '用户类型',
  })
  type: number;

  @Column({
    nullable: true,
    comment: 'LOGO id',
  })
  logoId: number;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}
