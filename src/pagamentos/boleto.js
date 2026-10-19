class BoletoPayment {
  calcular() {
    return {
      paymentFee: 0, discount: 0, paymentStatus: "waiting_payment"
    };
  }
}

module.exports = BoletoPayment;