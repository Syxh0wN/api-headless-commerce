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
exports.CreateCouponDto = exports.CouponType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var CouponType;
(function (CouponType) {
    CouponType["PERCENTAGE"] = "PERCENTAGE";
    CouponType["FIXED_AMOUNT"] = "FIXED_AMOUNT";
    CouponType["FREE_SHIPPING"] = "FREE_SHIPPING";
})(CouponType || (exports.CouponType = CouponType = {}));
class CreateCouponDto {
}
exports.CreateCouponDto = CreateCouponDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DESCONTO10' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Desconto de 10%' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: CouponType, example: CouponType.PERCENTAGE }),
    (0, class_validator_1.IsEnum)(CouponType),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10000, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "minimumAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "maximumDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-31T23:59:59Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "usageLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCouponDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-coupon.dto.js.map