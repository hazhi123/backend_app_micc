import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import * as CONST from '../../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../../common/decorators';
import { isEmptyUndefined } from '../../../common/helpers';
import { UsersEntity } from '../../users/entities/users.entity';
import {
  CreateMunicipiosDto,
  GetAllDto,
  UpdateMunicipiosDto,
} from './dto';
import { MunicipiosService } from './municipios.service';

@ApiTags(`${CONST.MODULES.UBIGEO.UBIGEO}/${CONST.MODULES.UBIGEO.MCPIO}`)
@Controller(`${CONST.MODULES.UBIGEO.UBIGEO}/${CONST.MODULES.UBIGEO.MCPIO}`)
export class MunicipiosController {
  constructor(
    private readonly estadosService: MunicipiosService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateMunicipiosDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.estadosService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Post('/all')
  async getAll(
    @Body() dto: GetAllDto,
  ) {
    const data = await this.estadosService.getAll(dto);
    let res = {
      statusCode: 200,
      data: data,
      message: ''
    }
    return res
  }

  @Auth()
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const data = await this.estadosService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateMunicipiosDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.estadosService.update(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(
    @Param('id') id: number,
  ) {
    const data = await this.estadosService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
