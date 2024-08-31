import EntityHelper from '../../utils/entities/entity-helper';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from 'automapper-classes';
import { User } from '../../users/entities/user.entity';

@Entity()
export class SearchHistory extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap(() => User)
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @AutoMap(() => String)
  @Column({ type: String, nullable: true })
  brand: string | null;

  @AutoMap(() => String)
  @Column({ type: String, nullable: true })
  model: string | null;

  @AutoMap(() => String)
  @Column({ type: String, nullable: true })
  color: string | null;

  @AutoMap(() => String)
  @Column({ type: String, nullable: true })
  referenceNumber: string | null;

  @AutoMap(() => String)
  @Column({ type: String, nullable: false })
  imageUrl: string;
}
