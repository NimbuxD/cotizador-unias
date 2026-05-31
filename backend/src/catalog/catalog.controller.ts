import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { UpdateCatalogItemDto } from './dto/update-catalog-item.dto';
import { FirebaseAuthGuard } from '../auth/auth.guard';
import { CurrentUser, AuthUser } from '../auth/user.decorator';

@UseGuards(FirebaseAuthGuard)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query('withPhotos') withPhotos?: string,
  ) {
    return this.catalogService.findAll(withPhotos === 'true', user.uid);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.catalogService.findOne(id, user.uid);
  }

  @Post()
  create(@Body() dto: CreateCatalogItemDto, @CurrentUser() user: AuthUser) {
    return this.catalogService.create(dto, user.uid);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCatalogItemDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.catalogService.update(id, dto, user.uid);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.catalogService.remove(id, user.uid);
  }

  @Post(':id/photos')
  addPhoto(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { photo: string },
    @CurrentUser() user: AuthUser,
  ) {
    return this.catalogService.addPhoto(id, body.photo, user.uid);
  }

  @Delete(':id/photos/:index')
  @HttpCode(HttpStatus.OK)
  removePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Param('index', ParseIntPipe) index: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.catalogService.removePhoto(id, index, user.uid);
  }
}
