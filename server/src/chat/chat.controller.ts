// src/chat/chat.controller.ts
import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history')
  async getChatHistory(
    @Query('userId') userId: string,
    @Query('peerId') peerId: string,
    @Query('applicationId') applicationId: string,
  ) {
    const uid = parseInt(userId, 10);
    const pid = parseInt(peerId, 10);
    const aid = parseInt(applicationId, 10);

    if (isNaN(uid) || isNaN(pid) || isNaN(aid)) {
      throw new BadRequestException('Некорректные параметры');
    }

    return this.chatService.getMessagesBetween(uid, pid, aid);
  }

  @Get('has-client-message')
  async hasClientMessage(
    @Query('clientId') clientId: string,
    @Query('peerId') peerId: string,
    @Query('applicationId') applicationId: string,
  ) {
    const cid = parseInt(clientId, 10);
    const pid = parseInt(peerId, 10);
    const aid = parseInt(applicationId, 10);

    if (isNaN(cid) || isNaN(pid) || isNaN(aid)) {
      throw new BadRequestException('Некорректные параметры');
    }

    const hasMessage = await this.chatService.hasMessageFromClient(cid, pid, aid);
    return { hasMessage };
  }
}