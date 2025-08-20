
import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // 프론트엔드 주소
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('웹소켓 서버가 초기화되었습니다.');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`클라이언트 연결: ${client.id}`);
    client.emit('connected', { sid: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`클라이언트 연결 해제: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ): void {
    client.join(room);
    this.logger.log(`클라이언트 ${client.id}가 ${room}에 참여했습니다.`);
    client.emit('message', `성공적으로 ${room}에 참여했습니다.`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ): void {
    client.leave(room);
    this.logger.log(`클라이언트 ${client.id}가 ${room}에서 나갔습니다.`);
    client.emit('message', `성공적으로 ${room}에서 나갔습니다.`);
  }
}
