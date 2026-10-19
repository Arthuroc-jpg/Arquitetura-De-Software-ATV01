class Customer {
  constructor(id, name, email, phone, discountStrategy, address) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.discountStrategy = discountStrategy;
    this.address = address;
  }

  calcularDesconto(subtotal) {
    return this.discountStrategy.calcularDesconto(subtotal);
  }
}

module.exports = Customer;
