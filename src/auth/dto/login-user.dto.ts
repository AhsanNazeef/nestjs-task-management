import { IsNotEmpty } from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
