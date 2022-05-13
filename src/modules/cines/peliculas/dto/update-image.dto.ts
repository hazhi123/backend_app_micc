import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cine: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  galeria: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  index: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  file: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  isBack: number;

}