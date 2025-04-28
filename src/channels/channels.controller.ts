import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Channels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('channels')
export class ChannelsController {
    constructor(private readonly channelsService: ChannelsService) { }

    @Post()
    @ApiOperation({ summary: 'Create new channel' })
    @ApiResponse({ status: 201, description: 'Channel created' })
    create(@Body() createChannelDto: CreateChannelDto) {
        return this.channelsService.create(createChannelDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all channels' })
    findAll() {
        return this.channelsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get channel by ID' })
    findOne(@Param('id') id: string) {
        return this.channelsService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update channel' })
    update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
        return this.channelsService.update(id, updateChannelDto);
    }

    @Post(':id/members/:userId')
    @ApiOperation({ summary: 'Add member to channel' })
    addMember(@Param('id') id: string, @Param('userId') userId: string) {
        return this.channelsService.addMember(id, userId);
    }

    @Delete(':id/members/:userId')
    @ApiOperation({ summary: 'Remove member from channel' })
    removeMember(@Param('id') id: string, @Param('userId') userId: string) {
        return this.channelsService.removeMember(id, userId);
    }
}