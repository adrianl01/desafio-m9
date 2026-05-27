import { firestore } from "../lib/firestore";

const collUser = firestore.collection("users");
const collOrders = firestore.collection("orders");

export class User {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;

  constructor(id: string) {
    this.id = id;
    this.ref = collUser.doc(id);
  }

  async pull() {
    const snap = await this.ref.get();

    this.data = snap.data();
  }

  async push() {
    await this.ref.update(this.data);
  }

  static async createNewUser(data: any) {
    const newUserSnap = await collUser.add(data);

    const newUser = new User(newUserSnap.id);

    newUser.data = data;

    return newUser;
  }

  async getUserOrders() {
    const query = await collOrders
      .where("userId", "==", this.id)
      .get();

    const orders = query.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return orders;
  }
}