import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router"
import parseToken from "parse-bearer-token"
import { decode } from "jsonwebtoken";
import { getUserById, updateAddtionalUserData, updateUserAddress } from "../../../controllers/users";
import { middleware } from "../middleware";



export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        console.log(req)
        const midRes = await middleware(req as any)
        console.log(midRes)
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
    },
    async patch(req: NextApiRequest, res: NextApiResponse) {
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
    }
})





