import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MunicipiosEntity } from '../../municipios/entities/municipios.entity';

@Entity('ubigeo_parroquias')
export class ParroquiasEntity {

  @PrimaryGeneratedColumn({ name: 'id_parroquia' })
  id: number;

  @Column()
  parroquia: string;

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
  @ManyToOne(() => MunicipiosEntity)
  @JoinColumn({ name: 'id_municipio' })
  municipio: number;

}
