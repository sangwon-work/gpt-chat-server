import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatRoomDto {
  @IsNotEmpty()
  @IsString()
  roomname: string;
  // roomtype: 'ONE_TO_ONE' | 'GROUP' | 'GPT';

  @IsNotEmpty()
  @IsArray()
  frienduserpkeylist: number[];
}
