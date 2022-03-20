import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateCComercialesDto,
  GetAllxAtributoDto,
  UpdateCComercialesDto,
} from './dto';
import { CComercialesEntity } from './entities/ccomerciales.entity';

@Injectable()
export class CComercialesService {

  relations = [
    'pais'
  ]

  constructor(
    @InjectRepository(CComercialesEntity)
    private readonly ccomercialesRP: Repository<CComercialesEntity>,

    private cloudinary: CloudinaryService
  ) { }

  async create(dto: CreateCComercialesDto, userLogin: UsersEntity) {
    await this.findNombre(dto.nombre, false)
    const save = await this.ccomercialesRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });
    return await this.getOne(save.id);
  }

  async getAll(): Promise<CComercialesEntity[]> {
    const find = await this.ccomercialesRP.find({
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getAllxAtributo(dto: GetAllxAtributoDto): Promise<CComercialesEntity[]> {
    let search = {}
    if (!isEmptyUndefined(dto.pais)) search['pais'] = dto.pais
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status
    const find = await this.ccomercialesRP.find({
      where: search,
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number): Promise<CComercialesEntity> {
    return await this.ccomercialesRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdateCComercialesDto, userLogin: UsersEntity) {
    if (isEmptyUndefined(userLogin)) throw new NotFoundException(CONST.MESSAGES.COMMON.ERROR.ROLES);
    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)
    const assing = Object.assign(getOne, {
      ...getOne,
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    })
    const save = await this.ccomercialesRP.save(assing)
    return await this.getOne(save.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.ccomercialesRP.delete(id);
    return getOne;
  }


  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.ccomercialesRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

  // async uploadImageToCloudinary(file: Express.Multer.File) {
  //   return await this.cloudinary.uploadImage(file).catch(() => {
  //     throw new BadRequestException('Invalid file type.');
  //   });
  // }

  // async createImage(file: any, id: number) {
  //   let image
  //   try {
  //     image = await this.uploadImageToCloudinary(file)
  //   } catch (error) {
  //     image = { url: '' }
  //   }
  //   await this.ccomercialesRP.createQueryBuilder()
  //     .update(CComercialesEntity)
  //     .set({ image: image.url })
  //     .where("id = :id", { id })
  //     .execute();
  //   return await this.getOne(id);
  // }

}