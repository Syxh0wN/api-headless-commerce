"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
class Money {
    amount;
    currency;
    constructor(amount, currency = 'BRL') {
        this.amount = amount;
        this.currency = currency;
        if (amount < 0) {
            throw new Error('Amount cannot be negative');
        }
        if (!Number.isInteger(amount)) {
            throw new Error('Amount must be an integer (cents)');
        }
    }
    static fromFloat(value, currency = 'BRL') {
        return new Money(Math.round(value * 100), currency);
    }
    toFloat() {
        return this.amount / 100;
    }
    toString() {
        return `${this.currency} ${this.toFloat().toFixed(2)}`;
    }
    add(other) {
        if (this.currency !== other.currency) {
            throw new Error('Cannot add money with different currencies');
        }
        return new Money(this.amount + other.amount, this.currency);
    }
    subtract(other) {
        if (this.currency !== other.currency) {
            throw new Error('Cannot subtract money with different currencies');
        }
        return new Money(this.amount - other.amount, this.currency);
    }
    multiply(factor) {
        return new Money(Math.round(this.amount * factor), this.currency);
    }
    equals(other) {
        return this.amount === other.amount && this.currency === other.currency;
    }
}
exports.Money = Money;
//# sourceMappingURL=money.js.map