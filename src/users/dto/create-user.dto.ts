import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { Status } from '../../statuses/entities/status.entity';
import { FileDto } from '../../files/dto/file.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  @Type(() => FileDto)
  @Validate(IsExist, ['FileEntity', 'id', 'validation.imageNotExists'])
  photo?: FileDto | null;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  password?: string;

  provider?: string;

  socialId?: string;

  @ApiProperty({ type: Role })
  @Validate(IsNotExist, ['Role', 'id'], {
    message: 'roleNotExists',
  })
  role: Role;

  @ApiProperty({ type: Status })
  @Validate(IsNotExist, ['Status', 'id'], {
    message: 'statusNotExists',
  })
  status?: Status;

  hash?: string | null;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address?: CreateAddressDto;

  @ApiProperty({ example: 'xe8emg58q2x27ohlfuz7n76u3btbzz4a' })
  @IsString()
  @IsOptional()
  notificationsToken?: string;

  @ApiProperty()
  @IsOptional()
  referralCode?: string;
}
