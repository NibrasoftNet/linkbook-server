import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Community } from '../../../community/entities/community.entity';
import { User } from '../../../users/entities/user.entity';
import { FileEntity } from '../../../files/entities/file.entity';

@Injectable()
export class CommunityFactory {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async createRandom(): Promise<Community> {
    // Fetch or create a user
    const users = await this.userRepository.find();
    if (users.length === 0) {
      throw new Error('No users available to assign as creators.');
    }
    const creator = faker.helpers.arrayElement(users);

    // Create and save a FileEntity for the image
    const image = this.fileRepository.create({
      id: faker.string.uuid(),
      path: faker.image.url(),
    });
    await this.fileRepository.save(image);

    // Create the Community
    const isPrivate = faker.datatype.boolean();
    const community = this.communityRepository.create({
      name: faker.company.name(),
      bio: faker.lorem.sentences(2),
      isPrivate,
      invitationCode: isPrivate ? faker.string.alphanumeric(8) : '0000', // Ensure no null values
      creator,
      image,
    });

    return community;
  }
}
