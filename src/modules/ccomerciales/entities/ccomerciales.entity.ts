import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { CategoriasEntity } from '../../categorias/entities/categorias.entity';
import {
  CinesCComercialesEntity,
} from '../../cines/cines/entities/cines-ccomerciales.entity';
import { ContactosEntity } from '../../contactos/entities/contactos.entity';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { HorariosEntity } from '../../horarios/entities/horarios.entity';
import { TiendasEntity } from '../../tiendas/entities/tiendas.entity';
import { CiudadesEntity } from '../../ubigeo/ciudades/entities/ciudades.entity';
import {
  ParroquiasEntity,
} from '../../ubigeo/parroquias/entities/parroquias.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { CComercialesGaleriaEntity } from './ccomerciales-galeria.entity';

@Entity(CONST.MODULES.CCOMERCIALES)
export class CComercialesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  correo: string;

  @Column({ name: 'tel_primero', type: 'varchar', default: '' })
  telPrimero: string;

  @Column({ name: 'tel_segundo', type: 'varchar', default: '' })
  telSegundo: string;

  @Column({ type: 'varchar', default: '' })
  direccion: string;

  @Column({ name: 'ubic_latlng', type: 'varchar', default: '' })
  ubicLatLng: string;

  @Column({ type: 'varchar', default: '' })
  desc: string;

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

  @Column({ type: 'bool', default: true })
  abierto: boolean;

  // Relaciones
  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria_image' })
  image: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria_back' })
  imageBack: number;

  @OneToMany(() => UsersEntity, users => users.ccomercial)
  users: UsersEntity[];

  @OneToMany(() => TiendasEntity, tiendas => tiendas.ccomercial)
  tiendas: TiendasEntity[];

  @OneToMany(() => CategoriasEntity, categoria => categoria.ccomercial)
  categorias: CategoriasEntity[];

  @OneToMany(() => ContactosEntity, categoria => categoria.ccomercial)
  contactos: ContactosEntity[];

  @OneToMany(() => CinesCComercialesEntity, cineCC => cineCC.ccomercial)
  cines: CinesCComercialesEntity[];

  @ManyToOne(() => CiudadesEntity)
  @JoinColumn({ name: 'id_ciudad' })
  ciudad: number;

  @ManyToOne(() => ParroquiasEntity)
  @JoinColumn({ name: 'id_parroquia' })
  parroquia: number;

  @OneToOne(() => HorariosEntity, horarios => horarios.ccomercial, { eager: true })
  horarios: number;

  @OneToMany(() => CComercialesGaleriaEntity, ccGal => ccGal.ccomercial)
  files: CComercialesGaleriaEntity[];

}
