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
import { IRoom } from 'src/modules/chat-room/typesDef';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Chat room')
@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @ApiCreatedResponse({
    description: 'Created chat room',
    type: ChatRoom,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Some field in body of query incorrect',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  save(@Body() data: createChatRoomDto): Promise<ChatRoom> {
    return this.chatRoomService.create(data);
  }

  @ApiCreatedResponse({
    description: 'Chat room by id',
  })
  @ApiNotFoundResponse({
    description:
      'Error occurred while finding chat room in db. Chat room not found',
  })
  @ApiServiceUnavailableResponse({
    description:
      'Unexpected error occurred while finding chat room in db or parsing returned data',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('room/:id')
  getOne(@Param() { id }: searchParamDto): Promise<IRoom> {
    return this.chatRoomService.getOneById(+id);
  }

  @ApiCreatedResponse({
    description: 'My chat rooms',
  })
  @ApiNotFoundResponse({
    description: 'Error occurred while finding user in db. User not found',
  })
  @ApiForbiddenResponse({
    description: 'Error occurred while check role of user in db',
  })
  @ApiServiceUnavailableResponse({
    description: 'Unexpected error occurred while finding chat rooms in db',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('self')
  getAllOwn(@Request() req: AuthRequest): Promise<IRoom[]> {
    return this.chatRoomService.getAllByUserId(req.user.id);
  }

  @ApiCreatedResponse({
    description: 'Chat rooms by id of post',
    type: [ChatRoom],
  })
  @ApiServiceUnavailableResponse({
    description: 'Unexpected error occurred while finding chat rooms in db',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('post/:id')
  getAllByJobPostId(@Param() { id }: searchParamDto): Promise<ChatRoom[]> {
    return this.chatRoomService.getAllByJobPostId(+id);
  }
}
