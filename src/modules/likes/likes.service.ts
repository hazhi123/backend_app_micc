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

import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateLikesDto,
  UpdateLikesDto,
} from './dto';
import { LikesEntity } from './entities/likes.entity';

@Injectable()
export class LikesService {

  relations = []

  constructor(
    @InjectRepository(LikesEntity)
    private readonly likesRP: Repository<LikesEntity>,

    private cloudinary: CloudinaryService
  ) { }

  async create(dto: CreateLikesDto, userLogin: UsersEntity) {
    const save = await this.likesRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<LikesEntity>> {
    const find = await this.likesRP.createQueryBuilder()
    if (isEmptyUndefined(find)) return null
    return paginate<LikesEntity>(find, options);
  }

  async getOne(id: number): Promise<LikesEntity> {
    return await this.likesRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdateLikesDto, userLogin: UsersEntity) {
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
    const save = await this.likesRP.save(assing)
    return await this.getOne(save.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.likesRP.delete(id);
    return getOne;
  }

}