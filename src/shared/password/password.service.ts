import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import * as crypto from 'crypto';

const HASH_TYPE = 'sha512';
const HASH_OUTPUT_TYPE = 'hex';
const UUID_DASH = '-';
const EMPTY_STRING = '';
const HASH_SPLIT_CHAR = ':';

@Injectable()
export class PasswordService {
  /**
   * salt 생성
   * @private
   */
  private generateSalt(): string {
    return uuid4().replaceAll(UUID_DASH, EMPTY_STRING);
  }

  /**
   * hash값 생성
   * @param password
   * @param salt
   * @private
   */
  private getHash(password: string, salt: string): string {
    return crypto
      .createHash(HASH_TYPE)
      .update(password + salt)
      .digest(HASH_OUTPUT_TYPE);
  }

  /**
   * 비밀번호 암호화
   * @param password
   */
  encrypt(password: string): string {
    const salt: string = this.generateSalt();
    return this.getHash(password, salt) + HASH_SPLIT_CHAR + salt;
  }

  valid(hashpassword: string, plainpassword: string) {
    const [hashText, salt] = hashpassword.split(':');
    return hashText === this.getHash(plainpassword, salt);
  }
}
