import {
  Controller,
  Get,
  Post,
  Request,
  Req,
  Response,
  Res,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseService } from '../../shared/response/response.service';
import { ChatRoomListFacadeService } from './facade/chat-room-list-facade.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { CreateChatRoomFacadeService } from './facade/create-chat-room-facade.service';
import { CreateOneToOneChatRoomDto } from './dto/create-one-to-one-chat-room.dto';
// eslint-disable-next-line max-len
import { CreateOneToOneChatRoomFacadeService } from './facade/create-one-to-one-chat-room-facade.service';

@Controller('chatting')
export class ChattingController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly chatRoomListFacadeService: ChatRoomListFacadeService,
    private readonly createChatRoomFacadeService: CreateChatRoomFacadeService,
    private readonly createOneToOneChatRoomFacadeService: CreateOneToOneChatRoomFacadeService,
  ) {}

  // 채팅방 목록 조회
  @Get('/room/list')
  @UseGuards(AuthGuard('access'))
  async getRoomList(@Req() req: Request, @Res() res: Response) {
    try {
      const { userpkey } = req['user'];

      const { roomlist } =
        await this.chatRoomListFacadeService.getRoomList(userpkey);
      return this.responseService.response(
        res,
        200,
        '0000',
        {},
        {
          roomlist: roomlist,
        },
      );
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  // 채팅방 만들기
  @Post('/room/create')
  @UseGuards(AuthGuard('access'))
  async createRoom(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createChatRoomDto: CreateChatRoomDto,
  ) {
    try {
      const { userpkey } = req['user'];
      const { roomid, chatroompkey } =
        await this.createChatRoomFacadeService.createRoom(
          userpkey,
          createChatRoomDto,
        );
      return this.responseService.response(
        res,
        200,
        '0000',
        {},
        { roomid, chatroompkey },
      );
    } catch (err) {
      console.log(err);
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  // 채팅방 상세 조회
  @Get('/room')
  @UseGuards(AuthGuard('access'))
  async getRoom(@Req() req: Request, @Res() res: Response) {
    try {
      return this.responseService.response(res, 200, '0000', {}, {});
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  // 채팅 보내기
  @Post('/send')
  @UseGuards(AuthGuard('access'))
  async postSend(@Req() req: Request, @Res() res: Response) {
    try {
      return this.responseService.response(res, 200, '0000', {}, {});
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  // 1:1 채팅방 생성
  @Post('/room/one-to-one')
  @UseGuards(AuthGuard('access'))
  async CreateOneToOneChatRoom(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createOneToOneChatRoomDto: CreateOneToOneChatRoomDto,
  ) {
    try {
      const { userpkey } = req['user'];
      const { rescode, body } =
        await this.createOneToOneChatRoomFacadeService.createOneToOneChatRoom(
          userpkey,
          createOneToOneChatRoomDto,
        );
      return this.responseService.response(res, 200, rescode, {}, body);
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }
}
