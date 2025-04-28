// create-channel.dto.ts
import { IsString, IsMongoId } from 'class-validator';

export class CreateChannelDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsMongoId()
    createdBy: string;
}
