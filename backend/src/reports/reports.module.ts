import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotation } from '../quotations/quotation.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Quotation])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
