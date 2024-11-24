import type { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token"
import { decode } from "jsonwebtoken";
import { updateUserAddress } from "../../../controllers/users";
import { runMiddleware } from "../../../lib/corsMiddleware";
export default async function address(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res);
    if (req.method === "PATCH") {
        const { address } = req.body
        const token = parseToken(req);
        if (!token) {
            res.status(401).send({ message: "no hay token" })
        }
        const decodedToken = decode(token) as any
        if (decodedToken) {
            const newUserAddress = await updateUserAddress(decodedToken.userId, address)
            res.send(newUserAddress)
        } else {
            res.status(401).send({ message: "token no autorizado" })
        }
        res.send({ message: "patch method" })
    } else {
        res.send({ message: "Method Not Allowed" })
    }
}

