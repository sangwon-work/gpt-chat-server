import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  private res: any;
  private statusCode: number;
  private resCode: string;
  private message: object | { kor: string; eng: string };

  private readonly STATUSCODE: number[] = [
    200, 201, 202, 204, 301, 302, 303, 307, 400, 401, 403, 404, 500, 502, 503,
    504,
  ];

  private readonly MESSAGES: object = {
    // status 200
    '0000': { kor: '성공', eng: 'success' },
    '0001': {
      kor: '핸드폰번호가 중복됩니다.',
      eng: 'phone number is duplicate.',
    },
    '0002': {
      kor: '회원을 찾을 수 없습니다.',
      eng: 'user is not found',
    },
    '0003': {
      kor: '비밀번호가 일치하지 않습니다.',
      eng: 'Password does not match',
    },

    // status 401
    '8000': { kor: '다시 로그인해주세요.', eng: 'Please log in again.' },

    // status 409

    // status 500
    '9999': { kor: '서버오류', eng: 'server error' },
    '9998': { kor: 'DB 오류', eng: 'database error' },
  };

  getMessageByCode(resCode: string): object {
    return this.MESSAGES[resCode];
  }

  isEmptyObject(message: object): boolean {
    return Object.keys(message).length === 0 && message.constructor === Object;
  }

  statusCodeValid(statusCode: number) {
    return this.STATUSCODE.indexOf(statusCode);
  }

  response(
    res: Response,
    statusCode: number,
    resCode: string,
    message: object | { kor: string; eng: string },
    body: object,
    langcode: 'KO' | 'EN' | 'JA' | 'ZH' = 'KO',
  ): Response {
    try {
      this.res = res;
      this.statusCode = statusCode;
      this.resCode = resCode;

      this.message =
        this.isEmptyObject(message) === false
          ? message
          : this.getMessageByCode(resCode) !== undefined
            ? this.getMessageByCode(resCode)
            : { kor: '', eng: '' };

      let resmessage: string;

      if (langcode === 'KO') {
        resmessage = this.message['kor'];
      } else {
        resmessage = this.message['eng'];
      }

      const valid = this.statusCodeValid(statusCode);
      if (valid === -1) {
        throw new HttpException(
          { message: 'status code not available' },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else {
        return this.res
          .status(this.statusCode)
          .json({ resCode: this.resCode, message: resmessage, body: body });
      }
    } catch (err) {
      throw err;
    }
  }
}
