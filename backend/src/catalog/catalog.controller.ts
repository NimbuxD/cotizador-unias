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
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { UpdateCatalogItemDto } from './dto/update-catalog-item.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll(@Query('withPhotos') withPhotos?: string) {
    return this.catalogService.findAll(withPhotos === 'true');
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCatalogItemDto) {
    return this.catalogService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCatalogItemDto,
  ) {
    return this.catalogService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.remove(id);
  }

  @Post(':id/photos')
  addPhoto(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { photo: string },
  ) {
    return this.catalogService.addPhoto(id, body.photo);
  }

  @Delete(':id/photos/:index')
  @HttpCode(HttpStatus.OK)
  removePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Param('index', ParseIntPipe) index: number,
  ) {
    return this.catalogService.removePhoto(id, index);
  }
}
