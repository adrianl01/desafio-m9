import type { NextApiRequest, NextApiResponse } from "next";
import { compareAsc } from "date-fns";
import { generate } from "../../../lib/jwt";
import { Auth } from "../../../models/auth";
import { runMiddleware } from "../../../lib/corsMiddleware";

export default async function token(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res);
  if (req.method === "POST") {
    const { email, code, status } = req.body;
    const newEmail = await Auth.findByEmail(email);
    if (code) {
      const parsedCode = JSON.parse(code) as number;
      if (parsedCode !== newEmail.data.code) {
        console.log("token incorrecto:", parsedCode);
        res.status(401).send({ message: "Wrong Token" });
      }
      const date = newEmail.data.expires.toDate();
      const currentDate = new Date();
      const expDate = compareAsc(date, currentDate);
      if (expDate == -1) {
        res.send({ message: "código expirado" });
      } else if (expDate !== -1) {
        // token se genera en base del userId
        const token = generate({ userId: newEmail.data.userId });
        res.send({ token });
      }
    }
  } else {
    res.send({ message: "Method Not Allowed" });
  }
}
