import type { NextApiRequest, NextApiResponse } from "next";

import { getMerchOrder } from "../../../lib/mercadoPago";

import { Order } from "../../../controllers/order";

import { runMiddleware } from "../../../lib/corsMiddleware";

import { handleApiError } from "../../../lib/handleApiError";

export default async function ipn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res);

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  try {
    const { id, topic } = req.query;

    if (
      !id ||
      typeof id !== "string" ||
      topic !== "merchant_order"
    ) {
      return res.status(400).json({
        message: "Invalid IPN payload",
      });
    }

    const merchOrder = await getMerchOrder({
      merchantOrderId: id,
    });

    if (!merchOrder) {
      throw new Error("Order not found");
    }

    if (merchOrder.order_status === "paid") {
      const orderId = merchOrder.external_reference;

      if (!orderId) {
        throw new Error("Order not found");
      }

      await Order.updateOrderStatus(
        orderId,
        "paid"
      );
    }

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    return handleApiError(res, error);
  }
}