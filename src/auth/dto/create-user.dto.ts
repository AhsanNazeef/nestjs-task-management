import { IsAlphanumeric, IsNotEmpty, Length } from 'class-validator';

export class createUserDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 12)
  username: string;

  @IsNotEmpty()
  @Length(6, 12)
  password: string;
}
