import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchOrder } from "../../../lib/mercadoPago";
import { Order } from "../../../controllers/order";
import methods from "micro-method-router"
import { runMiddleware } from "../../../lib/corsMiddleware";

export default async function ipn(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res);
    if (req.method === "POST") {
        const { id, topic } = req.query;
        if (topic == "merchant_order") {
            const order = await getMerchOrder({ merchantOrderId: id as string | number })
            if (order.order_status == "paid") {
                const orderId = order.external_reference
                const myOrder = new Order(orderId);
                await myOrder.pull();
                myOrder.data.status = "paid";
                await myOrder.push();
            }
            res.json(order);
        }
    } else {
        res.send({ message: "Method Not Allowed" })
    }
}
