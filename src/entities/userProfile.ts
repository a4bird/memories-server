import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
  Na = 'NA',
}

@Entity()
export class UserProfile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Na,
  })
  gender!: Gender;

  // TODO: s3Bucket Url for Profile pic
  // @Column()
  // photo: string;
}
