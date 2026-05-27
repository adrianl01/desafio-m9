import { OrderData, OrderModel } from "../models/order";

export class Order {
  static async createNewOrder(
    orderData: OrderData
  ) {
    const order = await OrderModel.create(orderData);

    return order;
  }

  static async getOrderById(orderId: string) {
    const order = new OrderModel(orderId);

    await order.pull();

    return order;
  }

  static async updateOrderStatus(
    orderId: string,
    status: "pending" | "paid" | "failed"
  ) {
    const order = new OrderModel(orderId);

    await order.pull();

    if (!order.data) {
      throw new Error("Order not found");
    }

    order.data.status = status;

    await order.push();

    return order.data;
  }
}