
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetUserForCommentsDto {
    @ApiProperty()
    readonly _id: string;
  
    @ApiProperty()
    readonly username: string;
  
    @ApiProperty()
    readonly photo: string;
}