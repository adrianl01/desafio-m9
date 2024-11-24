import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import parseToken from "parse-bearer-token"
import { decode } from "jsonwebtoken";
import { getUserById, updateAddtionalUserData, updateUserAddress } from "../../../controllers/users";
import { middleware } from "../middleware";
import { runMiddleware } from "../../../lib/corsMiddleware";

export default async function me(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        await runMiddleware(req, res);
        const token = parseToken(req);
        if (!token) {
            res.status(401).send({ message: "no hay token" })
        }
        const decodedToken = decode(token) as any
        console.log(decodedToken)
        if (decodedToken) {
            const user = await getUserById(decodedToken.userId)
            res.send(user)
        } else {
            res.status(401).send({ message: "token no autorizado" })
        }
    } else if (req.method === "PATCH") {
        const { additionalUserData } = req.body
        const token = parseToken(req);
        if (!token) {
            res.status(401).send({ message: "no hay token" })
        }
        const decodedToken = decode(token) as any
        if (decodedToken) {
            const newUserData = await updateAddtionalUserData(decodedToken.userId, additionalUserData)
            res.send(newUserData)
        } else {
            res.status(401).send({ message: "token no autorizado" })
        }
        res.send({ message: "patch method" })
    } else {
        res.send({ message: "Method Not Allowed" })
    }
}






