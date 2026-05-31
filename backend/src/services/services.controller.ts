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
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AddMaterialDto } from './dto/add-material.dto';
import { FirebaseAuthGuard } from '../auth/auth.guard';
import { CurrentUser, AuthUser } from '../auth/user.decorator';

@UseGuards(FirebaseAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() dto: CreateServiceDto, @CurrentUser() user: AuthUser) {
    return this.servicesService.create(dto, user.uid);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.servicesService.findAll(user.uid);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.servicesService.findOne(id, user.uid);
  }

  @Get(':id/cost')
  getCost(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.servicesService.calculateCost(id, user.uid);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.servicesService.update(id, dto, user.uid);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.servicesService.remove(id, user.uid);
  }

  @Post(':id/materials')
  addMaterial(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddMaterialDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.servicesService.addMaterial(id, dto, user.uid);
  }

  @Put(':id/materials/:materialId')
  updateMaterial(
    @Param('id', ParseIntPipe) id: number,
    @Param('materialId', ParseIntPipe) materialId: number,
    @Body() dto: AddMaterialDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.servicesService.updateMaterial(id, materialId, dto, user.uid);
  }

  @Delete(':id/materials/:materialId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMaterial(
    @Param('id', ParseIntPipe) id: number,
    @Param('materialId', ParseIntPipe) materialId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.servicesService.removeMaterial(id, materialId, user.uid);
  }
}
