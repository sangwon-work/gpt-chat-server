import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOneToOneChatRoomDto {
  @IsNotEmpty()
  @IsNumber()
  userpkey: number;
}
