import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import { Transform } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';
import { IsEmail, IsOptional, MinLength, Validate } from 'class-validator';
import { Status } from '../../statuses/entities/status.entity';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { FileEntity } from '../../files/entities/file.entity';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id', 'validation.imageNotExists'])
  photo?: FileEntity;

  @ApiProperty({ type: Role })
  @IsOptional()
  @Validate(IsExist, ['Role', 'id', 'validation.roleNotExists'])
  role?: Role;

  @ApiProperty({ type: Status })
  @IsOptional()
  @Validate(IsExist, ['Status', 'id', 'validation.statusNotExists'], {
    message: '',
  })
  status?: Status;

  hash?: string | null;
}
