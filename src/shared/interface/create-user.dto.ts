import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @ApiProperty()
  createdAt: Date;
}
