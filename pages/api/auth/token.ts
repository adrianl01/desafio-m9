import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import { compareAsc } from "date-fns";
import { generate } from "../../../lib/jwt";
import { Auth } from "../../../models/auth";
import { findOrCreateAuth } from "../../../controllers/auth";
import { runMiddleware } from "../../../lib/corsMiddleware";

export default async function token(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res);
    if (req.method === "POST") {
        const { email, code } = req.body;
        const parsedCode = JSON.parse(code) as number

        console.log(req.body)
        console.log("function api token");
        const newEmail = await Auth.findByEmail(email);
        if (parsedCode !== newEmail.data.code) {
            console.log("token incorrecto:", parsedCode)
            res.status(401).send({ message: "Token Incorrecto" })
        }
        if (newEmail.data.validCode == false) {
            console.log("token inválido,", newEmail.data.validCode)
            res.status(401).send({ message: "Token Inválido" })
        }
        console.log("continúa")

        const date = newEmail.data.expires.toDate();
        const currentDate = new Date();
        const expDate = compareAsc(date, currentDate);
        if (expDate == -1) {
            res.send({ message: "código expirado" })
        } else if (expDate !== -1) {
            // token se genera en base del userId
            const token = generate({ userId: newEmail.data.userId })
            const auth = await findOrCreateAuth(email);
            auth.data.validCode = false;
            await auth.push();
            res.send({ token })
        }
    } else {
        res.send({ message: "Method Not Allowed" })
    }
}
