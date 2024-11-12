import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import parseToken from "parse-bearer-token"
import { decode } from "jsonwebtoken";
import { updateUserAddress } from "../../../controllers/users";
export default methods({
    async patch(req: NextApiRequest, res: NextApiResponse) {
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
    }
})
