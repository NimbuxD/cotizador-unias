import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NailService } from './nail-service.entity';
import { ServiceMaterial } from './service-material.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NailService, ServiceMaterial]),
    ProductsModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService, TypeOrmModule],
})
export class ServicesModule {}
