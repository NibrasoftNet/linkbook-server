import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { User } from '../../users/entities/user.entity';
import { AutoMap } from 'automapper-classes';
import { FileEntity } from '../../files/entities/file.entity';

@Entity()
export class CommunityFeed extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  title: string;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap()
  @Column()
  url: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  creator: User;

  @AutoMap(() => [FileEntity])
  @ManyToMany(() => FileEntity, (file) => file, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  image: FileEntity[] | null;
}
