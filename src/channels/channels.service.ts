import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel, ChannelDocument } from './channels.schema';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
    constructor(
        @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>
    ) { }

    async create(createChannelDto: CreateChannelDto): Promise<ChannelDocument> {
        const channel = new this.channelModel({
            ...createChannelDto,
            members: [createChannelDto.createdBy],
            admins: [createChannelDto.createdBy]
        });
        return channel.save();
    }

    async findAll(): Promise<ChannelDocument[]> {
        return this.channelModel.find().exec();
    }

    async findById(id: string): Promise<ChannelDocument> {
        const channel = await this.channelModel.findById(id).exec();
        if (!channel) throw new NotFoundException('Channel not found');
        return channel;
    }

    async update(id: string, updateChannelDto: UpdateChannelDto): Promise<ChannelDocument> {
        const channel = await this.channelModel
            .findByIdAndUpdate(id, updateChannelDto, { new: true })
            .exec();
        if (!channel) throw new NotFoundException('Channel not found');
        return channel;
    }


    async addMember(channelId: string, userId: string): Promise<ChannelDocument> {
        const channel = await this.channelModel
            .findByIdAndUpdate(
                channelId,
                { $addToSet: { members: userId } },
                { new: true }
            )
            .exec();

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }
        return channel;
    }

    async removeMember(channelId: string, userId: string): Promise<ChannelDocument> {
        const channel = await this.channelModel
            .findByIdAndUpdate(
                channelId,
                { $pull: { members: userId } },
                { new: true }
            )
            .exec();

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }
        return channel;
    }
}