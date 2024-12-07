import { firestore } from "../lib/firestore";
const collUser = firestore.collection("users");
const collOrders = firestore.collection("orders");

export class User {
    ref: FirebaseFirestore.DocumentReference;
    data: any
    id: string
    constructor(id) {
        this.id = id
        this.ref = collUser.doc(id)
    }
    async pull() {
        const snap = await this.ref.get()
        this.data = snap.data()
    }
    async push() {
        this.ref.update(this.data)
    }
    static async createNewUser(data) {
        const newUserSnap = await collUser.add(data)
        const newUser = new User(newUserSnap.id)
        newUser.data = data
        return newUser
    }
    async getUserOrders() {
        const users = await collOrders.where("userId", "==", this.id);
        const orders = (await users.get()).docs.map((i) => { const orders = i.data(); return orders })
        return orders
    }
}