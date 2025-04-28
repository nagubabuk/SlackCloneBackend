import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post()
    @ApiOperation({ summary: 'Create new message' })
    create(@Body() createMessageDto: CreateMessageDto) {
        return this.messagesService.create(createMessageDto);
    }

    @Get('channel/:channelId')
    @ApiOperation({ summary: 'Get messages by channel' })
    @ApiResponse({ status: 200, description: 'List of messages' })
    findByChannel(
        @Param('channelId') channelId: string,
        @Query('page') page = 1,
        @Query('limit') limit = 50
    ) {
        return this.messagesService.findByChannel(channelId, page, limit);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update message' })
    update(@Param('id') id: string, @Body('content') content: string) {
        return this.messagesService.update(id, content);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete message' })
    delete(@Param('id') id: string) {
        return this.messagesService.delete(id);
    }
}