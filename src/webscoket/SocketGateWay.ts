import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway(4001, { transport: ['websocket'] })
export class MyWebSocketGateway {
  @SubscribeMessage('test')
  handleEvent(@MessageBody() data: string): string {
    console.log('data', data);
    return data;
  }
}
