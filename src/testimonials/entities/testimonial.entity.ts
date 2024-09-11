import { AutoMap } from 'automapper-classes';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity()
export class Testimonial extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap()
  @Column()
  rate: number;

  @AutoMap(() => User)
  @ManyToOne(() => User, {
    eager: true,
    nullable: false,
  })
  user: User;
}