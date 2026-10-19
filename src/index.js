const Address = require("./domain/Address");
const Customer = require("./domain/Customer");
const Order = require("./domain/Order");
const OrderItem = require("./domain/OrderItem");
const OrderService = require("./services/OrderService");
const NotificationService = require("./services/NotificationService");
const OrderRepository = require("./repositories/OrderRepository");
const ProductRepository = require("./repositories/ProductRepository");
const ProcessadorPayment = require("./domain/processador");
const CreditPayment = require("./pagamentos/credito");
const PixPayment = require("./pagamentos/pix");
const BoletoPayment = require("./pagamentos/boleto");
const Tech10 = require("./cupons/tech10");
const Sudeste = require("./regions/sudeste");
const Vip = require("./customer/vip");
const Logger = require("./utils/Logger");

const productRepository = new ProductRepository();
const orderRepository = new OrderRepository();
const notificationService = new NotificationService();
const logger = new Logger();

const paymentProcessor = new ProcessadorPayment({
  pix: new PixPayment(),
  credit_card: new CreditPayment(),
  boleto: new BoletoPayment()
});

const address = new Address(
  "Rua das Palmeiras",
  "120",
  "Presidente Prudente",
  "SP",
  "19000-000",
  new Sudeste()
);

const customer = new Customer(
  "c1",
  "Ana Souza",
  "ana.souza@example.com",
  "18999990000",
  new Vip(),
  address
);

const notebook = productRepository.findById("p1");
const mouse = productRepository.findById("p2");

const order = new Order(
  "o1001",
  customer,
  [new OrderItem(notebook, 1), new OrderItem(mouse, 2)],
  new Tech10(),
  "credit_card",
  3
);

const service = new OrderService({
  productRepository,
  orderRepository,
  notificationService,
  logger,
  paymentProcessor
});

const result = service.process(order);
console.log(JSON.stringify(result, null, 2));
