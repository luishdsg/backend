// posts/dto/create-post.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  content: string;

    @ApiProperty()
    @IsNotEmpty()
  @IsString()
  tag: string;
}
