class Address {
  constructor(street, number, city, state, zipCode, region) {
    this.street = street;
    this.number = number;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.region = region;
  }

  calcularFrete(peso) {
    return this.region.calcularFrete(peso);
  }
}

module.exports = Address;