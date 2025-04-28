import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
    @ApiProperty({ enum: ['online', 'offline', 'away', 'brb'] })
    @IsIn(['online', 'offline', 'away', 'brb'])
    status: string;
}