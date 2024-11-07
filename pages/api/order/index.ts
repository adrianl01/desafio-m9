import type { NextApiRequest, NextApiResponse } from "next";
import { generatePreference } from "../../../lib/mercadoPago";
import parseToken from "parse-bearer-token"
import { User } from "../../../models/users";
import { Order } from "../../../models/order";
import { decode } from "../../../lib/jwt";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { productId } = req.query as any
    const token = parseToken(req) as any;
    const decodedToken = decode(token) as any
    if (!token) { res.status(401) }
    const order = await Order.createNewOrder({
        additionalInfo: req.body,
        productId,
        userId: decodedToken.userId,
        status: "pending"
    })

    console.log("order:", order.id)

    const user = new User(decodedToken.userId)
    user.pull()
    const resPref = await generatePreference({
        body: {
            items: [
                {
                    id: "Sound system",
                    title: req.body.title,
                    description: "Dummy description",
                    picture_url: "http://www.myapp.com/myimage.jpg",
                    category_id: "car_electronics",
                    quantity: 1,
                    currency_id: "ARS",
                    unit_price: 10
                }
            ],
            back_urls: {
                success: "http://test.com/success",
                pending: "http://test.com/pending",
                failure: "http://test.com/failure"
            },
            external_reference: order.id,
            notification_url: "https://flujo-de-pago-git-main-adrians-projects-c7d56fd4.vercel.app/api/webhooks/mercadopago"
        }
    })
    res.send({ url: resPref.init_point })
}

