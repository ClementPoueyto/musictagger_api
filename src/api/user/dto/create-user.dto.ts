import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {

  
  @ApiProperty({
    description : 'email of the account',
    type  :String
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    description : 'password of the account',
    type  :String
  })
  @IsNotEmpty()
  public password: string;
  
}