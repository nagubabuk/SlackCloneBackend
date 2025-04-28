import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type ChannelDocument = Channel & Document;

@Schema({ timestamps: true })
export class Channel {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: User;

    @Prop([{ type: Types.ObjectId, ref: 'User' }])
    members: User[];

    @Prop({ default: 'public', enum: ['public', 'private'] })
    visibility: string;

    @Prop([{ type: Types.ObjectId, ref: 'User' }])
    admins: User[];
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);