import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { URLPAGE } from '../../config';

import * as CONST from '../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../common/decorators';
import { isEmptyUndefined } from '../../common/helpers';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateLikesDto,
  GetAllDto,
  UpdateLikesDto,
} from './dto';
import { LikesService } from './likes.service';

@ApiTags(CONST.MODULES.LIKES.toUpperCase())
@Controller(CONST.MODULES.LIKES)
export class LikesController {
  constructor(
    private readonly likesService: LikesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateLikesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.likesService.create(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  // @Auth()
  @Post('/all')
  async getAll(
    @Body() dto: GetAllDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  ) {
    limit = limit > 100 ? 100 : limit;
    const data = await this.likesService.getAll(dto, {
      page,
      limit,
      route: `${URLPAGE}/${CONST.MODULES.LIKES}/all`,
    });
    let res = {
      statusCode: HttpStatus.OK,
      data: data.items,
      meta: data.meta,
      links: data.links,
      message: ''
    }
    return res
  }

  @Auth()
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const data = await this.likesService.getOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateLikesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.likesService.update(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.likesService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
