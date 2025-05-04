// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage({
    senderId,
    receiverId,
    applicationId,
    text,
  }: {
    senderId: number;
    receiverId: number;
    applicationId: number;
    text: string;
  }) {
    return this.prisma.chatMessage.create({
      data: { senderId, receiverId, applicationId, text },
    });
  }

  async getMessagesBetween(user1: number, user2: number, applicationId: number) {
    return this.prisma.chatMessage.findMany({
      where: {
        applicationId,
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async hasMessageFromClient(clientId: number, managerId: number, applicationId: number): Promise<boolean> {
    const message = await this.prisma.chatMessage.findFirst({
      where: {
        senderId: clientId,
        receiverId: managerId,
        applicationId,
      },
    });
    return !!message;
  }
  
  
}
