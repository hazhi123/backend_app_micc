import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import {
  PublicacionesEntity,
} from '../publicaciones/entities/publicaciones.entity';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateComentariosDto,
  UpdateComentariosDto,
} from './dto';
import { ComentariosEntity } from './entities/comentarios.entity';

@Injectable()
export class ComentariosService {

  relations = [
    'publicacion'
  ]

  constructor(
    @InjectRepository(ComentariosEntity)
    private readonly comentariosRP: Repository<ComentariosEntity>,

    @InjectRepository(PublicacionesEntity)
    private readonly publicacionesRP: Repository<PublicacionesEntity>,

  ) { }

  async create(dto: CreateComentariosDto, userLogin: UsersEntity) {
    const save = await this.comentariosRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });

    const pub = await this.publicacionesRP.findOne({
      where: { id: dto.publicacion },
    });

    await this.publicacionesRP.createQueryBuilder()
      .update(PublicacionesEntity)
      .set({ totalComentarios: pub.totalComentarios + 1 })
      .where("id = :id", { id: dto.publicacion })
      .execute();

    return await this.getOne(save.id);
  }

  async getAll(id, options: IPaginationOptions): Promise<Pagination<ComentariosEntity>> {
    const find = await this.comentariosRP.createQueryBuilder('com')
      .leftJoinAndSelect("com.user", "user")
      .leftJoinAndSelect("user.image", "iUrl")
      .select([
        'com.id',
        'com.comentario',
        'com.createdAt',
        'user.nombre',
        'user.apellido',
        'iUrl.id',
        'iUrl.file',
      ])
      .where("com.publicacion = :id", { id })
      .orderBy('com.id', 'DESC')
    if (isEmptyUndefined(find)) return null
    return paginate<ComentariosEntity>(find, options);
  }

  async getOne(id: number): Promise<ComentariosEntity> {
    return await this.comentariosRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdateComentariosDto, userLogin: UsersEntity) {
    if (isEmptyUndefined(userLogin)) throw new NotFoundException(CONST.MESSAGES.COMMON.ERROR.ROLES);
    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)
    const assing = Object.assign(getOne, {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    })
    const save = await this.comentariosRP.save(assing)
    return await this.getOne(save.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);

    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)

    const pub = await this.publicacionesRP.findOne({
      where: { id: getOne.publicacion.id },
    });

    await this.publicacionesRP.createQueryBuilder()
      .update(PublicacionesEntity)
      .set({ totalComentarios: pub.totalComentarios - 1 })
      .where("id = :id", { id: getOne.publicacion.id })
      .execute();

    await this.comentariosRP.delete(id);

    return await this.getOne(getOne.id);
  }

}
