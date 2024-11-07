import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import { compareAsc } from "date-fns";
import { generate } from "../../../lib/jwt";
import { Auth } from "../../../models/auth";
import { findOrCreateAuth } from "../../../controllers/auth";


export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        const { email, code } = req.body as any;
        console.log("function api token");
        console.log(req.body);
        const newEmail = await Auth.findByEmail(email);
        console.log("email encontrado", newEmail.data)
        if (code !== newEmail.data.code) {
            res.status(401).send({ message: "Token Incorrecto" })
        }
        if (newEmail.data.validCode == false) {
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
    }
})