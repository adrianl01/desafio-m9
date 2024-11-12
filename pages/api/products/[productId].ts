import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import { productIndex } from "../../../lib/algolia";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        const productId = req.query.productId as any
        const resProduct = await productIndex.getObject(productId)
        res.send(resProduct)
    }
})