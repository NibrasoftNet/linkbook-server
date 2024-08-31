import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyJoinedCollectivityException extends HttpException {
  constructor() {
    super('User already joined collectivity', HttpStatus.BAD_REQUEST);
  }
}
