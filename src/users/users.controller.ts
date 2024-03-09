import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
    Get,
    Request,
  } from '@nestjs/common';
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('')
    async createUser(@Request() req) {
      return await this.usersService.createUser()
    }
}
