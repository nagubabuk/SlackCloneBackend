import {
    WebSocketGateway, WebSocketServer, OnGatewayInit,
    OnGatewayConnection, OnGatewayDisconnect,
    SubscribeMessage
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../common/guards/ws-jwt-auth.guard';
import { UsersService } from '../users/user.service';

@WebSocketGateway(parseInt(process.env.SOCKET_PORT || "3001"), {
    namespace: 'presence',
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})
@UseGuards(WsJwtAuthGuard)
export class PresenceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('PresenceGateway');

    constructor(private readonly usersService: UsersService) { }

    afterInit(server: Server) {
        this.logger.log('Presence Gateway initialized');
    }

    async handleConnection(client: Socket & { user: any }) {
        try {
            await this.usersService.updateStatus(client.user.id, 'online');
            this.server.emit('statusUpdate', {
                userId: client.user.id,
                status: 'online'
            });
        } catch (error) {
            client.disconnect(true);
        }
    }

    async handleDisconnect(client: Socket & { user: any }) {
        await this.usersService.updateStatus(client.user.id, 'offline');
        this.server.emit('statusUpdate', {
            userId: client.user.id,
            status: 'offline'
        });
    }

    @SubscribeMessage('setStatus')
    async setStatus(
        client: Socket & { user: any },
        payload: { status: 'online' | 'away' | 'brb' }
    ) {
        await this.usersService.updateStatus(client.user.id, payload.status);
        this.server.emit('statusUpdate', {
            userId: client.user.id,
            status: payload.status
        });
    }
}