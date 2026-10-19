class TECH10{
    aplicar(subtotal) {
    return {
        desconto: subtotal * 0.10, freteGratis: false
    };
  }
}

module.exports = TECH10;