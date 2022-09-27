import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { createChatRoomDto } from 'src/modules/chat-room/dto/create-chat-room.dto';
import { searchParamDto } from 'src/modules/chat-room/dto/search-param.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { IRoom } from './typesDef';

@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  save(@Body() data: createChatRoomDto): Promise<ChatRoom> {
    return this.chatRoomService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('room/:id')
  getOne(@Param() { id }: searchParamDto): Promise<IRoom> {
    return this.chatRoomService.getOneById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('self')
  getAllOwn(@Request() req: AuthRequest): Promise<IRoom[]> {
    return this.chatRoomService.getAllByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('post/:id')
  getAllByJobPostId(@Param() { id }: searchParamDto): Promise<ChatRoom[]> {
    return this.chatRoomService.getAllByJobPostId(+id);
  }
}
