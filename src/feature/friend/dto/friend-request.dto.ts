import { IsNotEmpty, IsNumber } from 'class-validator';

export class FriendRequestDto {
  @IsNotEmpty()
  @IsNumber()
  userpkey: number;
}
