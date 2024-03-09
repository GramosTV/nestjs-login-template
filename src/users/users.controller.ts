import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
    Get,
    Request,
  } from '@nestjs/common';
@Controller('users')
export class UsersController {
    constructor(private authService: UsersService) {}

    @Get('test')
    getProfile(@Request() req) {
      return 'ok'
    }
}
