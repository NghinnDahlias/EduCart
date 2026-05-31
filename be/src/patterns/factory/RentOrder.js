const BaseOrder = require('./BaseOrder');
const AppError = require('../../utils/AppError');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

class RentOrder extends BaseOrder {
  constructor(payload) {
    super(payload);
    this.orderType = 'Rent';

    const { rentStartDate, rentEndDate, dailyRate, depositRate = 0.5 } = payload;

    if (!rentStartDate || !rentEndDate) {
      throw new AppError(
        'Rent orders require rentStartDate and rentEndDate',
        400,
      );
    }

    const start = new Date(rentStartDate);
    const end = new Date(rentEndDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new AppError('Invalid rental dates', 400);
    }
    if (end <= start) {
      throw new AppError('rentEndDate must be after rentStartDate', 400);
    }
    if (!dailyRate || Number(dailyRate) <= 0) {
      throw new AppError('Rent orders require a positive dailyRate', 400);
    }

    this.rentStartDate = start;
    this.rentEndDate = end;
    this.dailyRate = Number(dailyRate);
    this.rentDays = Math.ceil((end - start) / MS_PER_DAY);

    // Fixed deposit of 100000 per rented item quantity
    const totalItems = this.items.reduce((s, it) => s + Number(it.quantity), 0);
    this.deposit = totalItems * 100000;
  }

  /**
   * Rent orders charge: (dailyRate * days) + deposit upfront.
   * Deposit is refunded when the order reaches DepositRefunded.
   */
  getFinalAmount() {
    return (this.dailyRate * this.rentDays) + this.deposit;
  }

  toPersistencePayload() {
    return {
      ...super.toPersistencePayload(),
      orderType: 'Rent',
      rentStartDate: this.rentStartDate,
      rentEndDate: this.rentEndDate,
      rentDays: this.rentDays,
      dailyRate: this.dailyRate,
      deposit: this.deposit,
    };
  }
}

module.exports = RentOrder;
