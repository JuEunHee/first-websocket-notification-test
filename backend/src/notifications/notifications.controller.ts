import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';

// DTO for request body validation
class NotificationDto {
  room?: string; // Optional: a specific room to send the notification to
  message: string;
  type: string;
  level: 'INFO' | 'WARN' | 'CRITICAL';
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly eventsGateway: EventsGateway) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  sendNotification(@Body() notificationDto: NotificationDto) {
    const { room, ...notificationData } = notificationDto;

    const payload = {
      ...notificationData,
      timestamp: new Date().toISOString(),
    };

    if (room) {
      // Send to a specific room
      this.eventsGateway.server.to(room).emit('notification', payload);
      return {
        status: 'success',
        message: `Notification sent to room: ${room}`,
      };
    } else {
      // Broadcast to all clients
      this.eventsGateway.server.emit('notification', payload);
      return {
        status: 'success',
        message: 'Notification broadcasted to all clients',
      };
    }
  }
}
