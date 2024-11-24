import type { NextApiRequest, NextApiResponse } from "next";
import { productIndex } from "../../../lib/algolia";
import { runMiddleware } from "../../../lib/corsMiddleware";

export default async function productId(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res)
    if (req.method === "GET") {
        const productId = req.query.productId as any
        const resProduct = await productIndex.getObject(productId)
        res.send(resProduct)
    } else {
        res.send({ message: "Method Not Allowed" })
    }
}
