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
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateLicenciasDto,
  GetAllDto,
  UpdateLicenciasDto,
} from './dto';
import { LicenciasEntity } from './entities/licencias.entity';

@Injectable()
export class LicenciasService {

  constructor(
    @InjectRepository(LicenciasEntity)
    private readonly licenciasRP: Repository<LicenciasEntity>
  ) { }

  async create(dto: CreateLicenciasDto, userLogin: UsersEntity) {
    await this.findLicencia(dto.licencia);
    const save = await this.licenciasRP.save({
      ...dto,
      createdBy: isEmptyUndefined(userLogin) ? dto.user : userLogin.id,
      createdAt: new Date(),
      updatedBy: isEmptyUndefined(userLogin) ? dto.user : userLogin.id,
      updatedAt: new Date(),
      status: true
    });
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<LicenciasEntity>> {
    const query = await this.licenciasRP
      .createQueryBuilder("lic")
    query.leftJoinAndSelect("lic.user", "user")
      .leftJoinAndSelect("lic.plan", "plan")
      .select([
        'lic.id',
        'lic.licencia',
        'lic.fechaInicio',
        'lic.fechaFinal',
        'lic.isGratis',
        'user.id',
        'user.nombre',
        'user.apellido',
        'user.user',
        'plan.id',
        'plan.nombre',
      ])
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('lic.status = :status', { status: dto.status })
    }
    query.orderBy("lic.id", "DESC")
    query.getMany();
    return paginate<LicenciasEntity>(query, options);
  }

  async getOne(id: number): Promise<LicenciasEntity> {
    const find = await this.licenciasRP
      .createQueryBuilder("lic")
      .leftJoinAndSelect("lic.user", "user")
      .leftJoinAndSelect("lic.plan", "plan")
      .select([
        'lic.id',
        'lic.licencia',
        'lic.fechaInicio',
        'lic.fechaFinal',
        'lic.isGratis',
        'lic.createdBy',
        'lic.createdAt',
        'lic.updatedBy',
        'lic.updatedAt',
        'user.id',
        'user.nombre',
        'user.apellido',
        'user.user',
        'plan.id',
        'plan.nombre',
      ])
      .where('lic.id = :id', { id })
      .getOne();
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async update(dto: UpdateLicenciasDto, userLogin: UsersEntity) {
    if (isEmptyUndefined(userLogin)) throw new NotFoundException(CONST.MESSAGES.COMMON.ERROR.ROLES);
    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)
    if (dto.id !== getOne.user.id) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Esta licencia no esta registrada con el usuario correcto',
    }, HttpStatus.ACCEPTED)
    await this.findLicencia(dto.licencia)
    const assing = Object.assign(getOne, {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    })
    await this.licenciasRP.update(getOne.id, assing)
    const res = await this.getOne(dto.id)
    return res
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.licenciasRP.delete(id);
    return getOne;
  }

  async findLicencia(licencia: string) {
    const findOne = await this.licenciasRP.findOne({ where: { licencia } })
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Esta licencia ya se encuentra registrada',
    }, HttpStatus.ACCEPTED)
  }

}
