import { Module } from '@nestjs/common';
import { MyWebSocketGateway } from '@/webscoket/SocketGateWay';
@Module({
  providers: [MyWebSocketGateway],
  exports: [MyWebSocketGateway],
})
export class SocketModule {}
