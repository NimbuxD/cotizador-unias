import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogItem } from './catalog-item.entity';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { UpdateCatalogItemDto } from './dto/update-catalog-item.dto';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(CatalogItem)
    private readonly catalogRepository: Repository<CatalogItem>,
  ) {}

  async findAll(withPhotos = false): Promise<Partial<CatalogItem>[]> {
    const items = await this.catalogRepository.find({
      order: { createdAt: 'DESC' },
    });

    if (!withPhotos) {
      return items.map(({ photos: _photos, ...rest }) => rest);
    }
    return items;
  }

  async findOne(id: number): Promise<CatalogItem> {
    const item = await this.catalogRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`CatalogItem #${id} not found`);
    }
    return item;
  }

  async create(dto: CreateCatalogItemDto): Promise<CatalogItem> {
    const item = this.catalogRepository.create({
      ...dto,
      tags: dto.tags ?? [],
      photos: dto.photos ?? [],
    });
    return this.catalogRepository.save(item);
  }

  async update(id: number, dto: UpdateCatalogItemDto): Promise<CatalogItem> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    await this.catalogRepository.save(item);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.catalogRepository.remove(item);
  }

  async addPhoto(id: number, photo: string): Promise<CatalogItem> {
    const item = await this.findOne(id);
    const photos = Array.isArray(item.photos) ? [...item.photos] : [];
    photos.push(photo);
    item.photos = photos;
    await this.catalogRepository.save(item);
    return this.findOne(id);
  }

  async removePhoto(id: number, index: number): Promise<CatalogItem> {
    const item = await this.findOne(id);
    const photos = Array.isArray(item.photos) ? [...item.photos] : [];
    if (index < 0 || index >= photos.length) {
      throw new NotFoundException(`Photo at index ${index} not found`);
    }
    photos.splice(index, 1);
    item.photos = photos;
    await this.catalogRepository.save(item);
    return this.findOne(id);
  }
}
