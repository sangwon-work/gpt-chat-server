import { Injectable } from '@nestjs/common';

@Injectable()
export class CalenderListFacadeService {
  constructor() {}

  async getCalenderList() {
    try {
      return { calenderlist: [] };
    } catch (err) {
      throw err;
    }
  }
}
