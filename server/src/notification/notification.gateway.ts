import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log('🔌 Клиент подключён:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('❌ Клиент отключился:', client.id);
  }

  sendApplicationStatusUpdate(applicationId: number, status: string) {
    this.server.emit('applicationStatusUpdate', { applicationId, status });
  }
}
