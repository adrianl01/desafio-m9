import { firestore } from "../lib/firestore";

const collection = firestore.collection("auth");

export class Auth {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;

  constructor(id: string) {
    this.id = id;
    this.ref = collection.doc(id);
  }

  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }

  async push() {
    await this.ref.update(this.data);
  }

  static async findByEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();

    const results = await collection
      .where("email", "==", cleanEmail)
      .limit(1)
      .get();

    if (!results.docs.length) {
      return null;
    }

    const first = results.docs[0];
    const auth = new Auth(first.id);
    auth.data = first.data();

    return auth;
  }

  static async createNewAuth(data: any) {
    const doc = await collection.add(data);
    const auth = new Auth(doc.id);
    auth.data = data;

    return auth;
  }
}