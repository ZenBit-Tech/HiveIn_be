import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { createChatRoomDto } from 'src/modules/chat-room/dto/create-chat-room.dto';
import { searchParamDto } from 'src/modules/chat-room/dto/search-param.dto';

@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  save(@Body() data: createChatRoomDto): Promise<ChatRoom> {
    return this.chatRoomService.create(data);
  }

  @Get(':id')
  getOne(@Param() { id }: searchParamDto): Promise<ChatRoom> {
    return this.chatRoomService.getOneById(+id);
  }

  @Get('post/:id')
  getManyByJobPostId(@Param() { id }: searchParamDto): Promise<ChatRoom[]> {
    return this.chatRoomService.getAllByJobPostId(+id);
  }

  @Get('user/:id')
  getManyByUserId(@Param() { id }: searchParamDto): Promise<ChatRoom[]> {
    return this.chatRoomService.getAllByUserId(+id);
  }
}
