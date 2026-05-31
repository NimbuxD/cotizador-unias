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
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { FirebaseAuthGuard } from '../auth/auth.guard';
import { CurrentUser, AuthUser } from '../auth/user.decorator';

@UseGuards(FirebaseAuthGuard)
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  create(@Body() dto: CreateQuotationDto, @CurrentUser() user: AuthUser) {
    return this.quotationsService.create(dto, user.uid);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.quotationsService.findAll(user.uid);
  }

  @Get('stats')
  getStats(@CurrentUser() user: AuthUser) {
    return this.quotationsService.getStats(user.uid);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.quotationsService.findOne(id, user.uid);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuotationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.quotationsService.update(id, dto, user.uid);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.quotationsService.remove(id, user.uid);
  }

  @Post(':id/arrive')
  markArrived(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.quotationsService.markArrived(id, user.uid);
  }

  @Post(':id/photos')
  addPhoto(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { photo: string },
    @CurrentUser() user: AuthUser,
  ) {
    return this.quotationsService.addPhoto(id, body.photo, user.uid);
  }

  @Delete(':id/photos/:index')
  @HttpCode(HttpStatus.OK)
  removePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Param('index', ParseIntPipe) index: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.quotationsService.removePhoto(id, index, user.uid);
  }
}
