import { firestore } from "../lib/firestore";
const collection = firestore.collection("orders");

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
        this.ref = collection.doc(id)
    }
    async pull() {
        const snap = await this.ref.get()
        this.data = snap.data() as any
    }
    async push() {
        this.ref.update(this.data)
    }

    static async createNewOrder(newOrderdata = {}) {
        const newOrderSnap = await collection.add(newOrderdata)
        const newOrder = new Order(newOrderSnap.id)
        newOrder.data = newOrderdata as any
        return newOrder
    }
}