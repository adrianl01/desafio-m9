import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "../../../lib/corsMiddleware";
import { handleApiError } from "../../../lib/handleApiError";
import { getProductById } from "../../../controllers/product";

export default async function productById(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  try {
    const { productId } = req.query;

    if (!productId || typeof productId !== "string") {
      throw new Error("Invalid data");
    }

    const product = await getProductById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    return res.status(200).json(product);
  } catch (error) {
    return handleApiError(res, error);
  }
}