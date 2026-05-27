import { firestore } from "../lib/firestore";

const collOrders = firestore.collection("orders");

export interface OrderData {
  additionalInfo: {
    title: string;
    description: string;
    picture_url: string;
    category_id: string;
    price: number;
  };

  status: "pending" | "paid" | "failed";

  productId: string;

  userId: string;
}

export class OrderModel {
  ref: FirebaseFirestore.DocumentReference;

  data: OrderData;

  id: string;

  constructor(id: string) {
    this.id = id;

    this.ref = collOrders.doc(id);
  }

  async pull() {
    const snap = await this.ref.get();

    this.data = snap.data() as OrderData;
  }

  async push() {
    await this.ref.set(this.data, {
      merge: true,
    });
  }

  static async create(newOrderData: OrderData) {
    const newOrderSnap = await collOrders.add(newOrderData);

    const order = new OrderModel(newOrderSnap.id);

    order.data = newOrderData;

    return order;
  }
}