import type { NextApiRequest, NextApiResponse } from "next";
import { airtableBase } from "../../../lib/airtable";
import { productIndex } from "../../../lib/algolia";
import { runMiddleware } from "../../../lib/corsMiddleware";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res)
    airtableBase('Furniture').select({
        pageSize: 10
    }).eachPage(
        async function page(records, fetchNextPage) {
            const objects = records.map(r => {
                console.log(r.fields.Images)
                return {
                    objectID: r.id,
                    ...r.fields
                };
            });
            await productIndex.saveObjects(objects)
            console.log("siguiente página")
            fetchNextPage()
        },
        function done(err) {
            if (err) { console.error(err); return; }
            res.send("terminó la sincronización entre airtable y algolia")
        }
    );
}