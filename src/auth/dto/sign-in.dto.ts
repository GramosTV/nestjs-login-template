import { IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @Length(3, 25, { message: 'Username must be between 3 and 25 characters' })
  username: string;

  @IsString()
  @Length(8, 100, { message: 'Password must be between 8 and 100 characters' })
  password: string;
}