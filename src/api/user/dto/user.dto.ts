import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class UserDto{



  @ApiProperty({
    description: 'account id',
    type: String,
  })
  @IsNumber()
  readonly id: number;

  @ApiProperty({
    description: 'email account'
  })
  @IsEmail()
  public email: string;

  @Exclude()
  public password: string;

  /*
   * Create and Update Date Columns
   */

  @ApiProperty({
    description: 'creation date account'
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'last update date account'
  })
  public updatedAt: Date;
}