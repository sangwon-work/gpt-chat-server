import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserProfileDto {
  @IsNotEmpty()
  @IsNumber()
  userpkey: number;
}
