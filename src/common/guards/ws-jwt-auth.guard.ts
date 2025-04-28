import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient<Socket>();
        const token = this.extractTokenFromSocket(client);

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET')
            });

            // Attach user to socket client
            client.data.user = payload;
            return true;
        } catch (e) {
            throw new UnauthorizedException('Invalid WebSocket token');
        }
    }

    private extractTokenFromSocket(client: Socket): string {
        const authHeader = client.handshake.headers.authorization;
        if (authHeader && authHeader.split(' ')[1]) {
            return authHeader.split(' ')[1];
        }

        const token = client.handshake.auth.token;
        if (token) {
            return token;
        }

        throw new UnauthorizedException('No authentication token found');
    }
}