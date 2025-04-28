import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';

@Injectable()
export class WebsocketMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    use(socket: Socket, next: (err?: Error) => void) {
        try {
            const token = this.extractToken(socket);
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET')
            });

            socket.data.user = payload;
            next();
        } catch (error) {
            next(new UnauthorizedException('Invalid authentication'));
        }
    }

    private extractToken(socket: Socket): string {
        const authHeader = socket.handshake.headers.authorization;
        if (authHeader && authHeader.split(' ')[1]) {
            return authHeader.split(' ')[1];
        }

        const token = socket.handshake.query.token;
        if (token && typeof token === 'string') {
            return token;
        }

        throw new UnauthorizedException('No authentication token found');
    }
}