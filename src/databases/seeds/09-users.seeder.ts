import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import { UsersEntity } from '../../modules/users/entities/users.entity';

export default class UsersSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(UsersEntity)
      .values([
        {
          nombre: 'Admin',
          apellido: 'Administrador',
          user: 'admiñ@admin.com',
          password: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
          perfil: 1,
          isVisitante: false,
          createdBy: 1,
          updatedBy: 1,
          status: true
        },
        {
          nombre: 'Centro',
          apellido: 'Coemrcial',
          user: 'cc@ccomercial.com',
          password: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
          perfil: 2,
          isVisitante: false,
          ccomercial: 1,
          createdBy: 1,
          updatedBy: 1,
          status: true
        },
        {
          nombre: 'Editor',
          apellido: 'Tienda',
          user: 't@tienda.com',
          password: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
          perfil: 3,
          isVisitante: false,
          ccomercial: 1,
          createdBy: 1,
          updatedBy: 1,
          status: true
        },
        {
          nombre: 'Visitante',
          apellido: 'Visita',
          user: 'visitante@gmail.com',
          password: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
          perfil: 3,
          createdBy: 1,
          updatedBy: 1,
          status: true
        },
      ])
      .execute()
  }
}