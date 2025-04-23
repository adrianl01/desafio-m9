import { firestore } from "../lib/firestore";
const collOrders = firestore.collection("orders");

type OrderData = {
    additionalInfo: "",
    status: "pending" | "paid" | "failed",
    productId: "",
    userId: ""
}

export class Order {
    ref: FirebaseFirestore.DocumentReference;
    data: OrderData
    id: string
    constructor(id) {
        this.id = id
        this.ref = collOrders.doc(id)
    }
    async pull() {
        const snap = await this.ref.get()
        this.data = snap.data() as any
    }
    async push() {
        this.ref.update(this.data)
    }
    static async createNewOrder(newOrderdata = {}) {
        console.log("create New Order")
        console.log(newOrderdata)
        const newOrderSnap = await collOrders.add(newOrderdata)
        const newOrder = new Order(newOrderSnap.id)
        newOrder.data = newOrderdata as any
        return newOrder
    }
    async getUserOrderById() {
        const order = collOrders.doc(this.id)
        return (await order.get()).data()

    }
}