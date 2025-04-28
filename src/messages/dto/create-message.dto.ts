// create-message.dto.ts
import { IsMongoId, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsMongoId()
    channel: string;

    @IsString()
    content: string;

    @IsMongoId()
    user: string;

    @IsString()
    fileUrl?: string;
}