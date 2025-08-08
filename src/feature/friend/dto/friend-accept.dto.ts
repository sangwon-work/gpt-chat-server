import { IsNotEmpty, IsNumber } from 'class-validator';

export class FriendAcceptDto {
  @IsNotEmpty()
  @IsNumber()
  userpkey: number;
}
