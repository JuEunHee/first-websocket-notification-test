import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { EventsModule } from '../events/events.module'; // EventsModule을 임포트합니다.

@Module({
  imports: [EventsModule], // EventsGateway를 사용하기 위해 EventsModule을 임포트합니다.
  controllers: [NotificationsController],
})
export class NotificationsModule {}
