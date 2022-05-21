import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContactosEntity } from '../contactos/entities/contactos.entity';
import { PerfilesModule } from '../perfiles/perfiles.module';
import { MensajesEntity } from './entities/mensajes.entity';
import { MensajesController } from './mensajes.controller';
import { MensajesService } from './mensajes.service';

@Module({
  imports: [
    PerfilesModule,
    TypeOrmModule.forFeature([ContactosEntity, MensajesEntity])
  ],
  controllers: [MensajesController],
  providers: [MensajesService],
  exports: [MensajesService]
})
export class MensajesModule { }
