import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>
    ) { }

    async create(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
        const message = new this.messageModel(createMessageDto);
        return message.save();
    }

    async findByChannel(
        channelId: string,
        page = 1,
        limit = 50
    ): Promise<MessageDocument[]> {
        return this.messageModel
            .find({ channel: channelId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user', 'name email status')
            .exec();
    }

    async update(id: string, content: string): Promise<MessageDocument> {
        const message= await this.messageModel
            .findByIdAndUpdate(id, { content, edited: true }, { new: true })
            .exec();

        if (!message) throw new NotFoundException('Channel not found');
        return message;
                   
    }

    async delete(id: string): Promise<MessageDocument> {
        const message=await this.messageModel.findByIdAndDelete(id).exec();
        if (!message) throw new NotFoundException('Channel not found');
        return message;
    }
}