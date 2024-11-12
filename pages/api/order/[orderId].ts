import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import parseToken from "parse-bearer-token"
import { decode } from "jsonwebtoken";
import { getUserById, } from "../../../controllers/users";
import { Order } from "../../../models/order";
import order from ".";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
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
    }
})