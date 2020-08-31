import * as bcrypt from 'bcryptjs';
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('user_accounts')
export class UserAccount extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('text')
  password: string;

  @Column('bool', { default: false })
  confirmed: boolean;

  @Column('bool', { default: false })
  forgotPasswordLocked: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}