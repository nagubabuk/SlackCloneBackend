import {
    WebSocketGateway, WebSocketServer, OnGatewayInit,
    SubscribeMessage, MessageBody, ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../common/guards/ws-jwt-auth.guard';
import { MessagesService } from '../messages/messages.service';
import { CreateMessageDto } from '../messages/dto/create-message.dto';

@WebSocketGateway(parseInt(process.env.SOCKET_PORT||'3001'), {
    namespace: 'chat',
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})
@UseGuards(WsJwtAuthGuard)
export class ChatGateway implements OnGatewayInit {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    constructor(private readonly messagesService: MessagesService) { }

    afterInit(server: Server) {
        this.logger.log('Chat Gateway initialized');
    }

    @SubscribeMessage('joinChannel')
    handleJoinChannel(
        @ConnectedSocket() client: Socket & { user: any },
        @MessageBody() channelId: string
    ) {
        client.join(channelId);
        client.emit('joinedChannel', channelId);
    }

    @SubscribeMessage('leaveChannel')
    handleLeaveChannel(
        @ConnectedSocket() client: Socket,
        @MessageBody() channelId: string
    ) {
        client.leave(channelId);
        client.emit('leftChannel', channelId);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @ConnectedSocket() client: Socket & { user: any },
        @MessageBody() createMessageDto: CreateMessageDto
    ) {
        const message = await this.messagesService.create({
            ...createMessageDto,
            userId: client.user.id
        });

        this.server.to(createMessageDto.channelId).emit('newMessage', message);
    }

    @SubscribeMessage('typing')
    handleTyping(
        @ConnectedSocket() client: Socket & { user: any },
        @MessageBody() payload: { channelId: string; isTyping: boolean }
    ) {
        client.to(payload.channelId).emit('userTyping', {
            userId: client.user.id,
            isTyping: payload.isTyping
        });
    }
}