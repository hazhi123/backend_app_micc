import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GaleriaEntity } from '../../../galeria/entities/galeria.entity';
import {
  PeliculasCategoriasEntity,
} from '../../peliculas-categorias/entities/peliculas-categorias.entity';
import { PeliculasCinesEntity } from './peliculas-cines.entity';

@Entity('pel_peliculas')
export class PeliculasEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  genero: string;

  @Column({ type: 'varchar', default: '' })
  duracion: string;

  @Column({ type: 'varchar', default: '' })
  sinopsis: string;

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
  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria_image' })
  image: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria_back' })
  imageBack: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria_video' })
  trailer: number;

  @ManyToOne(() => PeliculasCategoriasEntity)
  @JoinColumn({ name: 'id_categoria' })
  categoria: number;

  @OneToMany(() => PeliculasCinesEntity, cp => cp.pelicula)
  cines: PeliculasCinesEntity[];

}
