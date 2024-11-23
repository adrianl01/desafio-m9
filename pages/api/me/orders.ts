import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import parseToken from "parse-bearer-token"
import { decode } from "jsonwebtoken";
import { getUserOrders } from "../../../controllers/users";
import { runMiddleware } from "../../../lib/corsMiddleware";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        await runMiddleware(req, res)
        const token = parseToken(req);
        if (!token) {
            res.status(401).send({ message: "no hay token" })
        }
        const decodedToken = decode(token) as any
        console.log(decodedToken)
        if (decodedToken) {
            const orders = await getUserOrders(decodedToken.userId) as any
            if (orders.length == 0) { res.status(404).json({ message: "Aún no has realizado ninguna compra." }) } else {
                res.send(orders)
            }
        } else {
            res.status(401).send({ message: "token no autorizado" })
        }
    }
})