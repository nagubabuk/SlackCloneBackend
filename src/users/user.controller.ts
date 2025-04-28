import {
    Body,
    Controller, Get, Param, Patch, Query, UseGuards
} from '@nestjs/common';
import { UsersService } from './user.service';
import {
    ApiTags, ApiOperation, ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, type: [UserResponseDto] })
    async getAllUsers() {
        return this.usersService.findAllUsers();
    }

    @Get('search')
    @ApiOperation({ summary: 'Search users by name or email' })
    @ApiResponse({ status: 200, type: [UserResponseDto] })
    async searchUsers(@Query('q') query: string) {
        return this.usersService.searchUsers(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async getUserById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update user presence status' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async updateUserStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateUserStatusDto
    ) {
        return this.usersService.updateStatus(id, updateStatusDto.status);
    }
}