class ProcessadorPayment {
  constructor(formas) {
    this.formas = formas;
  }

  processar(order, subtotal) {
    const forma = this.formas[order.paymentMethod];

    if (!forma) {
      throw new Error("Forma de pagamento invalida.");
    }

    return forma.calcular(order, subtotal);
  }
}

module.exports = ProcessadorPayment;