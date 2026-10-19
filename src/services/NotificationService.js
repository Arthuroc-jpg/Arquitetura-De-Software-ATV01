class NotificationService {
  enviarConfirmacao(customer, orderId, total) {
    console.log(
      `Confirmacao do pedido ${orderId} enviada para ${customer.email}. Total: R$ ${total.toFixed(2)}`
    );
  }
}

module.exports = NotificationService;