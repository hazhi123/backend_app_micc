import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AsignarCComercialDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tienda: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ccomercial: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  correo: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  telefonos: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoria: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ubicacion: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

}