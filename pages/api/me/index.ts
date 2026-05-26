import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import parseToken from "parse-bearer-token"
import { decode } from "jsonwebtoken";
import { getUserById, updateAddtionalUserData, updateUserAddress } from "../../../controllers/users";
import { runMiddleware } from "../../../lib/corsMiddleware";

export default async function me(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res);
    if (req.method === "GET") {
        const token = parseToken(req);
        if (!token) {
            res.status(401).send({ message: "no hay token" })
        }
        const decodedToken = decode(token) as any
        if (decodedToken) {
            const user = await getUserById(decodedToken.userId)
            res.status(200).send(user)
        } else {
            res.status(401).send({ message: "unauthorized" })
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
            res.status(200).send(newUserData)
        } else {
            res.status(401).send({ message: "unauthorized" })
        }
    } else {
        res.status(405).send({ message: "Method Not Allowed" })
    }
}






