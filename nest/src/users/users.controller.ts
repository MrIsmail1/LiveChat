import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard)
  @Get()
  async getUsers(@Req() req: Request & { user: { userId: string } }) {
    return this.usersService.findAllUsers(req.user.userId);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user: { userId: string } }) {
    return this.usersService.findById(req.user.userId);
  }
}
