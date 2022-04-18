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
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import {
  CreateImageDto,
  createUsersDto,
  GetAllxAtributoDto,
  updatedUsersDto,
  UpdateImageDto,
} from './dto';
import { UsersInformacionEntity } from './entities/users-informacion.entity';
import { UsersEntity } from './entities/users.entity';
import { GaleriaService } from '../galeria/galeria.service';

@Injectable()
export class UsersService {

  relations = [
    'perfil',
    'informacion',
    'licencia',
    'pais',
    'ciudad',
    'imageUrl',
    'imageBack',
    'ccomercial',
    'ccomercial.pais',
    'ccomercial.ciudad',
    'ccomercial.horarios',
    'tienda',
    'tienda.categoria',
    'ccomerciales',
    'ccomerciales.ccomercial',
    'ccomerciales.ccomercial.pais',
    'ccomerciales.ccomercial.ciudad',
  ]

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRP: Repository<UsersEntity>,

    @InjectRepository(UsersInformacionEntity)
    private readonly informacionRP: Repository<UsersInformacionEntity>,

    @InjectRepository(GaleriaEntity)
    private readonly galeriaRP: Repository<GaleriaEntity>,

    private galeriaService: GaleriaService
  ) { }

  async create(isRegister, dto: createUsersDto, userLogin: UsersEntity) {
    // Valida el usuario si existe
    const userExist = await this.findUser(dto.user);
    if (!isEmptyUndefined(userExist)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Este usuario ya se encuentra registrado',
    }, HttpStatus.ACCEPTED)

    const {
      nombre,
      apellido,
      user,
      isVisitante,
      pais,
      password,
      ccomercial,
      tienda,
      perfil,
      status,
      dni,
      direccion,
      celular,
      telefono,
      ciudad,
      isTienda,
    } = dto

    // Es cuando el usuario se registra.
    if (isRegister && !userLogin) {
      if (dto.password !== dto.passwordConfirm) throw new HttpException({
        statusCode: HttpStatus.ACCEPTED,
        message: CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.ERROR.MATCH,
      }, HttpStatus.ACCEPTED)
      let data = {
        nombre,
        apellido,
        user,
        pais,
        ciudad,
        isVisitante: true,
        perfil: 3,
        password,
        createdBy: 0,
        createdAt: new Date(),
        updatedBy: 0,
        updatedAt: new Date(),
      };
      const create = await this.usersRP.create(data);
      const save = await this.usersRP.save(create);
      await this.informacionRP.save({
        correo: dto.user,
        user: save.id
      });
      delete save.password;
      return save;
    }

    // // Valida el numero de celular
    // await this.findCelular(dto.celular);

    // // Valida el dni si existe
    // await this.findDni(dto.dni);

    const create = await this.usersRP.create({
      nombre,
      apellido,
      user,
      password,
      ccomercial,
      tienda,
      isVisitante,
      pais,
      ciudad,
      isTienda,
      perfil,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status,
    });
    const save = await this.usersRP.save(create);

    await this.informacionRP.save({
      dni,
      celular,
      direccion,
      correo: dto.user,
      telefono,
      user: save.id
    });
    const getOne = await this.getOne(save.id)
    delete getOne.password;
    return getOne;
  }

  async getAll(isShowPassword: boolean = false) {
    const find = await this.usersRP.find({
      where: { isVisitante: false },
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    const arr = find.map(el => {
      if (!isShowPassword) delete el.password;
      return el;
    });
    return arr;
  }

  async getAllxAtributo(dto: GetAllxAtributoDto): Promise<UsersEntity[]> {
    let search = {}
    if (!isEmptyUndefined(dto.ccomercial)) search['ccomercial'] = dto.ccomercial
    if (!isEmptyUndefined(dto.tienda)) search['tienda'] = dto.tienda
    if (!isEmptyUndefined(dto.isVisitante)) search['isVisitante'] = dto.isVisitante
    if (!isEmptyUndefined(dto.isTienda)) search['isTienda'] = dto.isTienda
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status
    const find = await this.usersRP.find({
      where: search,
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number, userLogin?: UsersEntity) {
    const findOne = await this.usersRP.findOne({
      where: { id },
      relations: this.relations
    })
      .then(u => !userLogin ? u : !!u && userLogin.id === u.id ? u : null)
    if (!findOne) throw new NotFoundException('Usuario no existe');
    return findOne;
  }

  async update(dto: updatedUsersDto, userLogin: UsersEntity) {
    const getOne = await this.getOne(dto.id, null)
    if (!getOne) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    let { id,
      nombre,
      apellido,
      user,
      pais,
      ciudad,
      password,
      perfil,
      status,
      celular,
      ccomercial,
      isVisitante,
      tienda,
      dni,
      isTienda,
      direccion,
      telefono,
    } = dto

    const dataInformacion = {
      dni,
      celular,
      direccion,
      correo: user,
      telefono,
      user: id,
    }
    if (isEmptyUndefined(getOne.informacion)) {
      await this.informacionRP.save(dataInformacion);
    } else {
      const assinginformacion = Object.assign(getOne.informacion, dataInformacion)
      await this.informacionRP.update(getOne.informacion.user, assinginformacion);
    }

    delete getOne.informacion
    delete getOne.licencia
    delete getOne.publicaciones
    delete getOne.comentarios
    delete getOne.likes
    delete getOne.ccomerciales

    if (isVisitante) {
      getOne['ccomercial'] = null;
      getOne['tienda'] = null;
      ccomercial = null;
      tienda = null;
    }

    const objectUsers = Object.assign(getOne, {
      nombre,
      apellido,
      user,
      pais,
      ciudad,
      password,
      isVisitante,
      isTienda,
      perfil,
      ccomercial,
      tienda,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status,
    })
    if (isEmptyUndefined(dto.password)) {
      delete objectUsers.password
    }
    await this.usersRP.update(getOne.id, objectUsers);

    const res = await this.getOne(dto.id);
    delete res.password;
    return res;
  }

  async delete(id: number) {
    const getOne = await this.getOne(id, null)
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)

    await this.usersRP.update(id, { status: false });
    return await this.getOne(id, null);
  }

  async findUser(user: string) {
    return await this.usersRP
      .createQueryBuilder('user')
      .where({ user })
      .addSelect('user.password')
      .getOne()
  }

  async findCelular(celular: string) {
    const findOne = await this.informacionRP.findOne({
      where: { celular }
    })
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.USER.WARNING.MOBILE_CREATE,
    }, HttpStatus.ACCEPTED)
  }

  async findDni(dni: string) {
    const findOne = await this.informacionRP.findOne({
      where: { dni }
    })
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'El dni ya se encuentra registrado',
    }, HttpStatus.ACCEPTED)
  }

  async createImage(file: any, dto: CreateImageDto, userLogin: UsersEntity) {

    const getOne = await this.getOne(parseInt(dto.user));
    if (userLogin.isVisitante) {
      if (parseInt(dto.isBack) == 0) {
        await this.galeriaRP.delete(getOne.imageUrl)
      } else {
        await this.galeriaRP.delete(getOne.imageBack)
      }
    }

    let imageId;
    let res: GaleriaEntity
    try {
      const data = {
        entidad: 'user',
        entId: parseInt(dto.user),
        referencia: 'user',
        refId: parseInt(dto.user),
      }
      res = await this.galeriaService.create(file, data, userLogin)
      imageId = res.id
    } catch (error) {
      imageId = null
      res = null
    }

    if (parseInt(dto.isBack) == 0) {
      await this.usersRP.update(parseInt(dto.user),
        { imageUrl: imageId }
      );
    } else {
      await this.usersRP.update(parseInt(dto.user),
        { imageBack: imageId }
      );
    }
    return res;
  }

  async updateImage(dto: UpdateImageDto) {
    await this.usersRP.update(dto.user,
      dto.isBack ? { imageBack: dto.galeria } : { imageUrl: dto.galeria }
    );
    return await this.getOne(dto.user);
  }

}