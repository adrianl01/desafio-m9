import type { NextApiRequest, NextApiResponse } from "next";

import { Order } from "../../../controllers/order";

import { runMiddleware } from "../../../lib/corsMiddleware";

import { getUserFromRequest } from "../../../lib/getUserFromRequest";

export default async function order(
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
    const decodedToken = await getUserFromRequest(req);

    const { orderId } = req.query;

    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({
        message: "Invalid orderId",
      });
    }

    const order = await Order.getOrderById(orderId)

    await order.pull();

    if (!order.data) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // SEGURIDAD IMPORTANTE
    if (order.data.userId !== decodedToken.userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    return res.status(200).json(order.data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}