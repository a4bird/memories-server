import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
  Na = 'NA',
}

@Entity()
export class UserProfile {
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
