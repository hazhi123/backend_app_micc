import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CiudadesEntity } from '../../ciudades/entities/ciudades.entity';
import { MunicipiosEntity } from '../../municipios/entities/municipios.entity';
import { PaisesEntity } from '../../paises/entities/paises.entity';

@Entity('ubigeo_estados')
export class EstadosEntity {

  @PrimaryGeneratedColumn({ name: 'id_estado' })
  id: number;

  @Column()
  estado: string;

  Relaciones
  @ManyToOne(() => PaisesEntity)
  @JoinColumn({ name: 'id_pais' })
  pais: number;

  @OneToMany(() => MunicipiosEntity, mcpio => mcpio.estado)
  municipios: MunicipiosEntity[];

  @OneToMany(() => CiudadesEntity, ciu => ciu.estado)
  ciudades: CiudadesEntity[];

}
