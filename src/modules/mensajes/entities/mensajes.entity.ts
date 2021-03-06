import { UsersEntity } from '../../users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { ContactosEntity } from '../../contactos/entities/contactos.entity';

@Entity(CONST.MODULES.MENSAJES)
export class MensajesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '' })
  mensaje: string;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_by' })
  updatedBy: number;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'bool', default: true })
  status: boolean;

  // Relaciones
  @ManyToOne(() => ContactosEntity, contactos => contactos.mensajes)
  @JoinColumn({ name: 'contactos_id' })
  contacto: number;

  @ManyToOne(() => UsersEntity, users => users.mensajes)
  @JoinColumn({ name: 'user_id' })
  user: number;

}
