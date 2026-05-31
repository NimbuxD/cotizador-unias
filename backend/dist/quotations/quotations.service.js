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
exports.QuotationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quotation_entity_1 = require("./quotation.entity");
const quotation_service_entity_1 = require("./quotation-service.entity");
const services_service_1 = require("../services/services.service");
let QuotationsService = class QuotationsService {
    constructor(quotationRepository, quotationServiceRepository, servicesService) {
        this.quotationRepository = quotationRepository;
        this.quotationServiceRepository = quotationServiceRepository;
        this.servicesService = servicesService;
    }
    async create(dto) {
        let totalMaterialCost = 0;
        let suggestedPrice = 0;
        const serviceItems = [];
        for (const item of dto.services) {
            const qty = item.quantity ?? 1;
            const costBreakdown = await this.servicesService.calculateCost(item.serviceId);
            const materialCost = Math.round(costBreakdown.totalMaterialCost * qty * 100) / 100;
            const basePrice = Math.round(costBreakdown.basePrice * qty * 100) / 100;
            totalMaterialCost += materialCost;
            suggestedPrice += basePrice;
            serviceItems.push({
                serviceId: item.serviceId,
                quantity: qty,
                materialCost,
            });
        }
        totalMaterialCost = Math.round(totalMaterialCost * 100) / 100;
        suggestedPrice = Math.round(suggestedPrice * 100) / 100;
        const quotation = this.quotationRepository.create({
            clientName: dto.clientName,
            clientPhone: dto.clientPhone,
            date: dto.date,
            totalMaterialCost,
            suggestedPrice,
            finalPrice: dto.finalPrice ?? suggestedPrice,
            notes: dto.notes,
            status: quotation_entity_1.QuotationStatus.PENDING,
        });
        const saved = await this.quotationRepository.save(quotation);
        for (const item of serviceItems) {
            const qs = this.quotationServiceRepository.create({
                quotationId: saved.id,
                serviceId: item.serviceId,
                quantity: item.quantity,
                materialCost: item.materialCost,
            });
            await this.quotationServiceRepository.save(qs);
        }
        return this.findOne(saved.id);
    }
    async findAll() {
        return this.quotationRepository.find({
            relations: { services: { service: true } },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const quotation = await this.quotationRepository.findOne({
            where: { id },
            relations: {
                services: {
                    service: {
                        materials: { product: true },
                    },
                },
            },
        });
        if (!quotation) {
            throw new common_1.NotFoundException(`Quotation #${id} not found`);
        }
        return quotation;
    }
    async update(id, dto) {
        const quotation = await this.findOne(id);
        if (dto.services && dto.services.length > 0) {
            let totalMaterialCost = 0;
            let suggestedPrice = 0;
            const serviceItems = [];
            for (const item of dto.services) {
                const qty = item.quantity ?? 1;
                const costBreakdown = await this.servicesService.calculateCost(item.serviceId);
                const materialCost = Math.round(costBreakdown.totalMaterialCost * qty * 100) / 100;
                const basePrice = Math.round(costBreakdown.basePrice * qty * 100) / 100;
                totalMaterialCost += materialCost;
                suggestedPrice += basePrice;
                serviceItems.push({ serviceId: item.serviceId, quantity: qty, materialCost });
            }
            await this.quotationServiceRepository.delete({ quotationId: id });
            for (const item of serviceItems) {
                const qs = this.quotationServiceRepository.create({
                    quotationId: id,
                    serviceId: item.serviceId,
                    quantity: item.quantity,
                    materialCost: item.materialCost,
                });
                await this.quotationServiceRepository.save(qs);
            }
            quotation.totalMaterialCost = Math.round(totalMaterialCost * 100) / 100;
            quotation.suggestedPrice = Math.round(suggestedPrice * 100) / 100;
        }
        const { services: _services, ...rest } = dto;
        Object.assign(quotation, rest);
        await this.quotationRepository.save(quotation);
        return this.findOne(id);
    }
    async remove(id) {
        const quotation = await this.findOne(id);
        await this.quotationRepository.remove(quotation);
    }
    async getStats() {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            .toISOString()
            .split('T')[0];
        const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            .toISOString()
            .split('T')[0];
        const [total, pending, confirmed, cancelled] = await Promise.all([
            this.quotationRepository.count(),
            this.quotationRepository.count({ where: { status: quotation_entity_1.QuotationStatus.PENDING } }),
            this.quotationRepository.count({ where: { status: quotation_entity_1.QuotationStatus.CONFIRMED } }),
            this.quotationRepository.count({ where: { status: quotation_entity_1.QuotationStatus.CANCELLED } }),
        ]);
        const todayCount = await this.quotationRepository.count({
            where: { date: todayStr },
        });
        const monthlyQuotations = await this.quotationRepository.find({
            where: {
                date: (0, typeorm_2.Between)(firstOfMonth, lastOfMonth),
                status: quotation_entity_1.QuotationStatus.CONFIRMED,
            },
        });
        const monthlyRevenue = monthlyQuotations.reduce((sum, q) => sum + Number(q.finalPrice ?? q.suggestedPrice), 0);
        const monthlyMaterialCost = monthlyQuotations.reduce((sum, q) => sum + Number(q.totalMaterialCost), 0);
        const allQuotations = await this.quotationRepository.find();
        const averageQuotationValue = allQuotations.length > 0
            ? allQuotations.reduce((sum, q) => sum + Number(q.finalPrice ?? q.suggestedPrice), 0) / allQuotations.length
            : 0;
        return {
            total,
            pending,
            confirmed,
            cancelled,
            todayCount,
            monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
            monthlyMaterialCost: Math.round(monthlyMaterialCost * 100) / 100,
            averageQuotationValue: Math.round(averageQuotationValue * 100) / 100,
        };
    }
};
exports.QuotationsService = QuotationsService;
exports.QuotationsService = QuotationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quotation_entity_1.Quotation)),
    __param(1, (0, typeorm_1.InjectRepository)(quotation_service_entity_1.QuotationService)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        services_service_1.ServicesService])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map