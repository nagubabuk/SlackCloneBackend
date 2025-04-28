import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const user = await this.usersService.create(registerDto);
        return this.generateToken(user);
    }

    async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.usersService.updateStatus(user._id, 'online');
        return this.generateToken(user);
    }

    private generateToken(user: any): { accessToken: string } {
        const payload = {
            sub: user._id,
            email: user.email,
            name: user.name
        };
        return {
            accessToken: this.jwtService.sign(payload, {
                secret: this.configService.get('jwtSecret'),
                expiresIn: '1d'
            })
        };
    }
}