import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetUsersDto {
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
  @IsString()
  gender: string;
}
