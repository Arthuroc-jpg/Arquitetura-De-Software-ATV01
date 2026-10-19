class CreditPayment {
  calcular(order, subtotal) {
    return {
      paymentFee: order.installments > 1 ? subtotal * 0.025 : 0, discount: 0, paymentStatus: "approved"
    };
  }
}

module.exports = CreditPayment;