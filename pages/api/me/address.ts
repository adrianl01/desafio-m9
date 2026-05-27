import type { NextApiRequest, NextApiResponse } from "next";

import parseToken from "parse-bearer-token";

import { decode } from "../../../lib/jwt";

import { updateUserAddress } from "../../../controllers/users";

import { runMiddleware } from "../../../lib/corsMiddleware";
import { getUserFromRequest } from "../../../lib/getUserFromRequest";

export default async function address(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res);

  if (req.method !== "PATCH") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        message: "Address is required",
      });
    }

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

    const newUserAddress = await updateUserAddress(
      decodedToken.userId,
      address
    );

    return res.status(200).json(newUserAddress);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}