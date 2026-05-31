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
exports.Product = exports.ProductUnit = exports.ProductCategory = void 0;
const typeorm_1 = require("typeorm");
const service_material_entity_1 = require("../services/service-material.entity");
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["POLISH"] = "polish";
    ProductCategory["GEL"] = "gel";
    ProductCategory["TIPS"] = "tips";
    ProductCategory["NAIL_ART"] = "nail_art";
    ProductCategory["TOOLS"] = "tools";
    ProductCategory["SUPPLIES"] = "supplies";
    ProductCategory["OTHER"] = "other";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var ProductUnit;
(function (ProductUnit) {
    ProductUnit["ML"] = "ml";
    ProductUnit["GRAMS"] = "grams";
    ProductUnit["UNITS"] = "units";
    ProductUnit["METERS"] = "meters";
})(ProductUnit || (exports.ProductUnit = ProductUnit = {}));
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: ProductCategory,
        default: ProductCategory.OTHER,
    }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: ProductUnit,
        default: ProductUnit.UNITS,
    }),
    __metadata("design:type", String)
], Product.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "currentStock", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "minStock", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => service_material_entity_1.ServiceMaterial, (sm) => sm.product),
    __metadata("design:type", Array)
], Product.prototype, "serviceMaterials", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products')
], Product);
//# sourceMappingURL=product.entity.js.map