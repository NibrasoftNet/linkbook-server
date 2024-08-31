import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';

export class SubscribeToCollectivityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(IsExist, ['Collectivity', 'referralCode'], {
    message: 'CollectivityNotExists',
  })
  referralCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Validate(IsExist, ['User', 'id'], {
    message: 'UserNotExists',
  })
  userId: number;
}
