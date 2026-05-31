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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceMaterial = void 0;
const typeorm_1 = require("typeorm");
const nail_service_entity_1 = require("./nail-service.entity");
const product_entity_1 = require("../products/product.entity");
let ServiceMaterial = class ServiceMaterial {
};
exports.ServiceMaterial = ServiceMaterial;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ServiceMaterial.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ServiceMaterial.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ServiceMaterial.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], ServiceMaterial.prototype, "quantityUsed", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nail_service_entity_1.NailService, (service) => service.materials, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'serviceId' }),
    __metadata("design:type", nail_service_entity_1.NailService)
], ServiceMaterial.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.serviceMaterials, {
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], ServiceMaterial.prototype, "product", void 0);
exports.ServiceMaterial = ServiceMaterial = __decorate([
    (0, typeorm_1.Entity)('service_materials')
], ServiceMaterial);
//# sourceMappingURL=service-material.entity.js.map