import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateLicenciasDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  licencia: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fechaInicio: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fechaFinal: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: any;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

}
