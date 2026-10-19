class Order {
  constructor(id, customer, items, coupon, paymentMethod, installments) {
    this.id = id;
    this.customer = customer;
    this.items = items;
    this.coupon = coupon;
    this.paymentMethod = paymentMethod;
    this.installments = installments;
    this.status = "created";
    this.createdAt = new Date();
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  getTotalWeight() {
    return this.items.reduce(
      (total, item) => total + item.product.weight * item.quantity,
      0
    );
  }
}

module.exports = Order;
