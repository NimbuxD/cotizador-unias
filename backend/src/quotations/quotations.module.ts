import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotation } from './quotation.entity';
import { QuotationService } from './quotation-service.entity';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quotation, QuotationService]),
    ServicesModule,
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}
