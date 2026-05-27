import type { NextApiRequest, NextApiResponse } from "next";

import parseToken from "parse-bearer-token";

import { decode } from "../../../lib/jwt";

import { getUserOrders } from "../../../controllers/users";

import { runMiddleware } from "../../../lib/corsMiddleware";
import { getUserFromRequest } from "../../../lib/getUserFromRequest";

export default async function myOrders(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  try {
    const token = parseToken(req);

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decodedToken = await getUserFromRequest(req);

    if (!decodedToken || typeof decodedToken === "string") {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const orders = await getUserOrders(decodedToken.userId);

    if (!orders.length) {
      return res.status(404).json({
        message: "Aún no has realizado ninguna compra.",
      });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}