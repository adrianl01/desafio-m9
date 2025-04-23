import type { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token"
import { decode } from "jsonwebtoken";
import { Order } from "../../../controllers/order";
import { runMiddleware } from "../../../lib/corsMiddleware";

export default async function order(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res)
    if (req.method === "GET") {
        const { orderId } = req.query as any
        console.log(orderId)
        const token = parseToken(req);
        if (!token) {
            res.status(401).send({ message: "no hay token" })
        }
        const decodedToken = decode(token) as any
        if (decodedToken) {
            const newOrder = new Order(orderId)
            const order = await newOrder.getUserOrderById()
            res.send(order)
        } else {
            res.status(401).send({ message: "token no autorizado" })
        }
    } else {
        res.send({ message: "Method Not Allowed" })
    }
}
