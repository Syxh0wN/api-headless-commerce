export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'BRL',
  ) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (!Number.isInteger(amount)) {
      throw new Error('Amount must be an integer (cents)');
    }
  }

  static fromFloat(value: number, currency: string = 'BRL'): Money {
    return new Money(Math.round(value * 100), currency);
  }

  toFloat(): number {
    return this.amount / 100;
  }

  toString(): string {
    return `${this.currency} ${this.toFloat().toFixed(2)}`;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this.amount * factor), this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
