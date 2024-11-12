import type { NextApiRequest, NextApiResponse } from "next";
import { getOffsetAndLimitFromReq } from "../../../lib/requests";
import { productIndex } from "../../../lib/algolia";
import methods from "micro-method-router"
console.log("products")

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        const { offset, limit } = getOffsetAndLimitFromReq(req)
        const results = await productIndex.search(req.query.search as string, {
            offset: offset, length: limit
        })
        results.hits.map(h => {
            const result = h._highlightResult as any
            console.log(result.Name)
        })
        res.send(
            {
                results: results.hits,
                pagination: {
                    offset: offset,
                    limit: limit,
                    total: results.nbHits
                }
            }
        )
    }
})