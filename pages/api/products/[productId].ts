import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import { productIndex } from "../../../lib/algolia";
import { runMiddleware } from "../../../lib/corsMiddleware";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        await runMiddleware(req, res)
        const productId = req.query.productId as any
        const resProduct = await productIndex.getObject(productId)
        res.send(resProduct)
    }
})