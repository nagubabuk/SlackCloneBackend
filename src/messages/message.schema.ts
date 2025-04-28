import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';
import { Channel } from '../channels/channels.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: Types.ObjectId, ref: 'Channel', required: true })
    channel: Channel;

    @Prop({ required: true })
    content: string;

    @Prop()
    fileUrl: string;

    @Prop({ default: false })
    edited: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);