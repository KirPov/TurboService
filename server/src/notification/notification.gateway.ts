// src/notification/notification.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: "*",
  }
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Метод, вызываемый при подключении клиента
  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  // Метод, вызываемый при отключении клиента
  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  // Метод для отправки уведомлений клиенту о статусе заявки
  sendApplicationStatusUpdate(applicationId: number, status: string) {
    this.server.emit('applicationStatusUpdate', { applicationId, status });
  }
}
