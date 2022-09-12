import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketService implements OnGatewayInit {
  @WebSocketServer()
  private server: Server;

  afterInit(server: any) {
    server;
    console.log('Server', this.server);
  }
}
