import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AddMaterialDto } from './dto/add-material.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Get(':id/cost')
  getCost(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.calculateCost(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }

  // Material management
  @Post(':id/materials')
  addMaterial(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddMaterialDto,
  ) {
    return this.servicesService.addMaterial(id, dto);
  }

  @Put(':id/materials/:materialId')
  updateMaterial(
    @Param('id', ParseIntPipe) id: number,
    @Param('materialId', ParseIntPipe) materialId: number,
    @Body() dto: AddMaterialDto,
  ) {
    return this.servicesService.updateMaterial(id, materialId, dto);
  }

  @Delete(':id/materials/:materialId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMaterial(
    @Param('id', ParseIntPipe) id: number,
    @Param('materialId', ParseIntPipe) materialId: number,
  ) {
    return this.servicesService.removeMaterial(id, materialId);
  }
}
