class PixPayment {
  calcular(order, subtotal) {
    return {
      paymentFee: 0, discount: subtotal * 0.03, paymentStatus: "approved"
    };
  }
}

module.exports = PixPayment;