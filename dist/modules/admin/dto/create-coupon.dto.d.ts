export declare enum CouponType {
    PERCENTAGE = "PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT",
    FREE_SHIPPING = "FREE_SHIPPING"
}
export declare class CreateCouponDto {
    code: string;
    description: string;
    type: CouponType;
    value: number;
    minimumAmount?: number;
    maximumDiscount?: number;
    validUntil: string;
    validFrom?: string;
    usageLimit?: number;
    isActive?: boolean;
}
