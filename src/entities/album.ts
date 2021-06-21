import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { UserAccount } from './userAccount';

@Entity()
export class Album extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 255 })
  description: string;

  @Column('datetime')
  createdAt: Date;

  @ManyToOne(() => UserAccount)
  userAccount: UserAccount;

  @PrimaryGeneratedColumn('uuid')
  userAccountId: string;
}
