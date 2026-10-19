class OrderService {
  constructor({productRepository, orderRepository, notificationService, logger, paymentProcessor}) {
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.notificationService = notificationService;
    this.logger = logger;
    this.paymentProcessor = paymentProcessor;
  }

  process(order) {
    if (!order) {
      throw new Error("Pedido obrigatorio.");
    }

    this.logger.info(`Iniciando processamento do pedido ${order.id}.`);

    if (!order.customer) {
      throw new Error("Cliente obrigatorio.");
    }

    if (!order.customer.email || !order.customer.email.includes("@")) {
      throw new Error("E-mail do cliente invalido.");
    }

    if (!order.customer.address) {
      throw new Error("Endereco do cliente obrigatorio.");
    }

    if (!order.items || order.items.length === 0) {
      throw new Error("Pedido sem itens.");
    }

    const quantitiesByProduct = new Map();

    for (const item of order.items) {
      if (!item.product) {
        throw new Error("Item sem produto.");
      }

      if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
        throw new Error("Quantidade invalida.");
      }

      const product = this.productRepository.findById(item.product.id);

      if (!product) {
        throw new Error(`Produto ${item.product.id} nao encontrado.`);
      }

      const requiredQuantity =
        (quantitiesByProduct.get(product.id)?.quantity ?? 0) + item.quantity;

      if (product.stock < requiredQuantity) {
        throw new Error(`Estoque insuficiente para ${product.name}.`);
      }

      quantitiesByProduct.set(product.id, {
        product,
        quantity: requiredQuantity
      });
    }

    const subtotal = order.getSubtotal();
    const couponResult = order.coupon ? order.coupon.aplicar(subtotal) : null;

    let discount = couponResult ? couponResult.desconto : order.customer.calcularDesconto(subtotal);

    if (subtotal > 8000) {
      discount += 250;
    }

    const totalWeight = order.getTotalWeight();
    let freight = order.customer.address.calcularFrete(totalWeight);

    if (couponResult && couponResult.freteGratis) {
      freight = 0;
    }

    const payment = this.paymentProcessor.processar(order, subtotal);
    discount += payment.discount;

    const { paymentFee, paymentStatus } = payment;
    if (!["approved", "waiting_payment"].includes(paymentStatus)) {
      throw new Error("Status de pagamento invalido.");
    }

    const total = Number(
      (subtotal - discount + freight + paymentFee).toFixed(2)
    );

    if (!Number.isFinite(total) || total <= 0) {
      throw new Error("Total do pedido invalido.");
    }

    for (const item of order.items) {
      this.productRepository.updateStock(item.product.id, item.quantity);
    }

    order.status =
      paymentStatus === "approved" ? "confirmed" : "waiting_payment";

    const orderSummary = {
      id: order.id,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      city: order.customer.address.city,
      state: order.customer.address.state,
      items: order.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        subtotal: item.getSubtotal()
      })),
      subtotal,
      discount: Number(discount.toFixed(2)),
      freight: Number(freight.toFixed(2)),
      paymentFee: Number(paymentFee.toFixed(2)),
      total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt
    };

    this.orderRepository.save(orderSummary);

    if (order.status === "confirmed") {
      this.notificationService.enviarConfirmacao(
        order.customer,
        order.id,
        total
      );
    } else {
      this.logger.warn(`Pedido ${order.id} aguardando pagamento.`);
    }

    console.log("Resumo do pedido");
    console.log(`Cliente: ${order.customer.name}`);
    console.log(
      `Cidade: ${order.customer.address.city}/${order.customer.address.state}`
    );
    console.log(`Itens: ${order.getTotalItems()}`);
    console.log(`Subtotal: R$ ${subtotal.toFixed(2)}`);
    console.log(`Desconto: R$ ${discount.toFixed(2)}`);
    console.log(`Frete: R$ ${freight.toFixed(2)}`);
    console.log(`Taxas: R$ ${paymentFee.toFixed(2)}`);
    console.log(`Total: R$ ${total.toFixed(2)}`);

    return orderSummary;
  }
}

module.exports = OrderService;
