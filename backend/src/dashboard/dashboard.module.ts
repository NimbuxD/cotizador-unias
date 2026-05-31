import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ProductsModule } from '../products/products.module';
import { QuotationsModule } from '../quotations/quotations.module';

@Module({
  imports: [ProductsModule, QuotationsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
