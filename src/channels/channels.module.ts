import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from './channels.schema';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }])
    ],
    controllers: [ChannelsController],
    providers: [ChannelsService],
    exports: [ChannelsService]
})
export class ChannelsModule { }