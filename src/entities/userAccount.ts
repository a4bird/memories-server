import * as bcrypt from 'bcryptjs';
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserProfile } from './userProfile';

@Entity()
export class UserAccount extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('varchar', { length: 100 })
  password: string;

  @Column('bool', { default: false })
  confirmed: boolean;

  @Column('bool', { default: false })
  forgotPasswordLocked: boolean;

  @OneToOne((type) => UserProfile, {
    cascade: true,
  })
  @JoinColumn()
  profile: UserProfile;

  @Column({ nullable: true })
  profileId?: number;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(8));
  }
}
