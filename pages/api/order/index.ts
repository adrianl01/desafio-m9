import type { NextApiRequest, NextApiResponse } from "next";
import { generatePreference } from "../../../lib/mercadoPago";
import parseToken from "parse-bearer-token"
import { User } from "../../../models/users";
import { Order } from "../../../models/order";
import { decode } from "../../../lib/jwt";
import { productIndex } from "../../../lib/algolia";
import { runMiddleware } from "../../../lib/corsMiddleware";

export default async function createOrder(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res)
    if (req.method === "POST") {
        const { productId } = req.query as any;
        const token = parseToken(req) as any;
        const decodedToken = await decode(token) as any;
        console.log("decodedToke", decodedToken);
        if (!token) { res.status(401).send({ message: "No autorizado" }) };
        const resProduct = await productIndex.getObject(productId, {
            attributesToRetrieve: ['objectID', 'Name', 'Description', 'Images', 'Type', 'Unit_cost']
        }) as any;
        const order = await Order.createNewOrder({
            additionalInfo: {
                title: resProduct.Name,
                description: resProduct.Description,
                picture_url: resProduct.Images[0].url,
                category_id: resProduct.Type,
                price: resProduct.Unit_cost
            },
            productId,
            userId: decodedToken.userId,
            status: "pending"
        })
        const user = new User(decodedToken.userId)
        user.pull()
        const resPref = await generatePreference({
            body: {
                items: [
                    {
                        id: resProduct.objectID,
                        title: resProduct.Name,
                        description: resProduct.Description,
                        picture_url: resProduct.Images[0].url,
                        category_id: resProduct.Type,
                        quantity: 1,
                        currency_id: "ARS",
                        unit_price: resProduct.Unit_cost
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
        res.send({
            url: resPref.init_point,
            orderId: order.id
        })
    } else {
        res.send({ message: "Method Not Allowed" })
    }
}

