import {
  Get,
  Module,
  Req,
  Res,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { ResponseService } from '../../shared/response/response.service';
import { AuthGuard } from '@nestjs/passport';

@Module({})
export class CalenderModule {
  constructor(private readonly responseService: ResponseService) {}

  /**
   * 캘린더 목록 조회
   * @param req
   * @param res
   */
  @Get('/list')
  @UseGuards(AuthGuard('access'))
  async getCalenderList(@Req() req: Request, @Res() res: Response) {
    try {
      return this.responseService.response(res, 200, '0000', {}, {});
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }
}
