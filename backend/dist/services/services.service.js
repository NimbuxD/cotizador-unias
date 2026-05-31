"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nail_service_entity_1 = require("./nail-service.entity");
const service_material_entity_1 = require("./service-material.entity");
const product_service_1 = require("../products/product.service");
let ServicesService = class ServicesService {
    constructor(serviceRepository, materialRepository, productService) {
        this.serviceRepository = serviceRepository;
        this.materialRepository = materialRepository;
        this.productService = productService;
    }
    async create(dto) {
        const service = this.serviceRepository.create(dto);
        return this.serviceRepository.save(service);
    }
    async findAll() {
        return this.serviceRepository.find({
            relations: { materials: { product: true } },
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const service = await this.serviceRepository.findOne({
            where: { id },
            relations: { materials: { product: true } },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service #${id} not found`);
        }
        return service;
    }
    async update(id, dto) {
        const service = await this.findOne(id);
        Object.assign(service, dto);
        return this.serviceRepository.save(service);
    }
    async remove(id) {
        const service = await this.findOne(id);
        await this.serviceRepository.remove(service);
    }
    async addMaterial(serviceId, dto) {
        await this.findOne(serviceId);
        await this.productService.findOne(dto.productId);
        const existing = await this.materialRepository.findOne({
            where: { serviceId, productId: dto.productId },
        });
        if (existing) {
            throw new common_1.ConflictException(`Product #${dto.productId} is already linked to service #${serviceId}. Use PUT to update quantity.`);
        }
        const material = this.materialRepository.create({
            serviceId,
            productId: dto.productId,
            quantityUsed: dto.quantityUsed,
        });
        return this.materialRepository.save(material);
    }
    async updateMaterial(serviceId, materialId, dto) {
        await this.findOne(serviceId);
        const material = await this.materialRepository.findOne({
            where: { id: materialId, serviceId },
        });
        if (!material) {
            throw new common_1.NotFoundException(`Material #${materialId} not found for service #${serviceId}`);
        }
        Object.assign(material, dto);
        return this.materialRepository.save(material);
    }
    async removeMaterial(serviceId, materialId) {
        await this.findOne(serviceId);
        const material = await this.materialRepository.findOne({
            where: { id: materialId, serviceId },
        });
        if (!material) {
            throw new common_1.NotFoundException(`Material #${materialId} not found for service #${serviceId}`);
        }
        await this.materialRepository.remove(material);
    }
    async calculateCost(serviceId) {
        const service = await this.findOne(serviceId);
        const materials = service.materials.map((m) => {
            const unitCost = Number(m.product.unitCost);
            const qty = Number(m.quantityUsed);
            return {
                productId: m.productId,
                productName: m.product.name,
                quantityUsed: qty,
                unit: m.product.unit,
                unitCost,
                lineCost: Math.round(unitCost * qty * 100) / 100,
            };
        });
        const totalMaterialCost = materials.reduce((sum, m) => sum + m.lineCost, 0);
        return {
            serviceId: service.id,
            serviceName: service.name,
            materials,
            totalMaterialCost: Math.round(totalMaterialCost * 100) / 100,
            basePrice: Number(service.basePrice),
        };
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nail_service_entity_1.NailService)),
    __param(1, (0, typeorm_1.InjectRepository)(service_material_entity_1.ServiceMaterial)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        product_service_1.ProductService])
], ServicesService);
//# sourceMappingURL=services.service.js.map