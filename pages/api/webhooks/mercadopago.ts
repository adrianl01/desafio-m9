import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchOrder } from "../../../lib/mercadoPago";
import { Order } from "../../../models/order";


export default async function (req: NextApiRequest, res: NextApiResponse) {
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
}