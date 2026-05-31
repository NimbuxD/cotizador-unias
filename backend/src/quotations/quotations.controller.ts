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
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';

@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  create(@Body() dto: CreateQuotationDto) {
    return this.quotationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.quotationsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.quotationsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quotationsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuotationDto,
  ) {
    return this.quotationsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quotationsService.remove(id);
  }

  @Post(':id/arrive')
  markArrived(@Param('id', ParseIntPipe) id: number) {
    return this.quotationsService.markArrived(id);
  }

  @Post(':id/photos')
  addPhoto(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { photo: string },
  ) {
    return this.quotationsService.addPhoto(id, body.photo);
  }

  @Delete(':id/photos/:index')
  @HttpCode(HttpStatus.OK)
  removePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Param('index', ParseIntPipe) index: number,
  ) {
    return this.quotationsService.removePhoto(id, index);
  }
}
