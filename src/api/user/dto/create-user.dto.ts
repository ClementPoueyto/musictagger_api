import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'firstname user',
    type: String,
  })
  public firstname: string;

  @ApiProperty({
    description: 'firstname user',
    type: String,
  })
  public lastname: string;

  @ApiProperty({
    description: 'email of the account',
    type: String,
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: 'password of the account',
    type: String,
  })
  @IsNotEmpty()
  public password: string;
}
