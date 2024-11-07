import admin from "firebase-admin";
console.log("FIREBASE EN USO")
var serviceAccount = JSON.parse(process.env.FIREBASE_CONNECTION);
// para solucionar el error de vercel
if (admin.apps.length == 0) {
    console.log("adminApp:", admin.app.length)
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const firestore = admin.firestore()

export { firestore }
