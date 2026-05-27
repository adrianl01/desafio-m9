import type { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token";

import { decode } from "../../../lib/jwt";

import {
  getUserById,
  updateAddtionalUserData,
} from "../../../controllers/users";

import { runMiddleware } from "../../../lib/corsMiddleware";
import { getUserFromRequest } from "../../../lib/getUserFromRequest";

export default async function me(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res);

  try {
    const token = parseToken(req);

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decodedToken = await getUserFromRequest(req);;

    if (!decodedToken || typeof decodedToken === "string") {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.method === "GET") {
      const user = await getUserById(decodedToken.userId);

      return res.status(200).json(user);
    }

    if (req.method === "PATCH") {
      const { additionalUserData } = req.body;

      if (!additionalUserData) {
        return res.status(400).json({
          message: "Missing additionalUserData",
        });
      }

      const newUserData = await updateAddtionalUserData(
        decodedToken.userId,
        additionalUserData
      );

      return res.status(200).json(newUserData);
    }

    return res.status(405).json({
      message: "Method Not Allowed",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}