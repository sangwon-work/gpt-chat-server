import { LastMessageVo } from './last-message.vo';

export class ChatRoomListVo {
  chatroompkey: number;
  roomid: string;
  roomname: string;
  lastmessage: LastMessageVo;
  updatedat: string;
}
