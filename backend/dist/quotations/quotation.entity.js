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
exports.Quotation = exports.QuotationStatus = void 0;
const typeorm_1 = require("typeorm");
const quotation_service_entity_1 = require("./quotation-service.entity");
var QuotationStatus;
(function (QuotationStatus) {
    QuotationStatus["PENDING"] = "pending";
    QuotationStatus["CONFIRMED"] = "confirmed";
    QuotationStatus["CANCELLED"] = "cancelled";
})(QuotationStatus || (exports.QuotationStatus = QuotationStatus = {}));
let Quotation = class Quotation {
};
exports.Quotation = Quotation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Quotation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Quotation.prototype, "clientName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "clientPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Quotation.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Quotation.prototype, "totalMaterialCost", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Quotation.prototype, "suggestedPrice", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Quotation.prototype, "finalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: QuotationStatus,
        default: QuotationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Quotation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Quotation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Quotation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quotation_service_entity_1.QuotationService, (qs) => qs.quotation, { cascade: true }),
    __metadata("design:type", Array)
], Quotation.prototype, "services", void 0);
exports.Quotation = Quotation = __decorate([
    (0, typeorm_1.Entity)('quotations')
], Quotation);
//# sourceMappingURL=quotation.entity.js.map