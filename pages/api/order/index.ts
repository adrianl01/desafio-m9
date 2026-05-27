import type { NextApiRequest, NextApiResponse } from "next";
import { generatePreference } from "../../../lib/mercadoPago";
import { User } from "../../../models/users";
import { Order } from "../../../controllers/order";
import { productIndex } from "../../../lib/algolia";
import { runMiddleware } from "../../../lib/corsMiddleware";
import { getUserFromRequest } from "../../../lib/getUserFromRequest";

export default async function createOrder(
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
    const decodedToken = await getUserFromRequest(req);
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Missing productId",
      });
    }

    const product = await productIndex.getObject(productId, {
      attributesToRetrieve: [
        "objectID",
        "Name",
        "Description",
        "Images",
        "Type",
        "Unit_cost",
      ],
    }) as any;

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const imageUrl =
      product.Images?.[0]?.url || "";

    const order = await Order.createNewOrder({
      additionalInfo: {
        title: product.Name,
        description: product.Description,
        picture_url: imageUrl,
        category_id: product.Type,
        price: product.Unit_cost,
      },
      productId: product.objectID,
      userId: decodedToken.userId,
      status: "pending",
    });

    const user = new User(decodedToken.userId);

    await user.pull();

    const preference = await generatePreference({
      body: {
        items: [
          {
            id: product.objectID,
            title: product.Name,
            description: product.Description,
            picture_url: imageUrl,
            category_id: product.Type,
            quantity: 1,
            currency_id: "ARS",
            unit_price: product.Unit_cost,
          },
        ],

        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
        },

        external_reference: order.id,

        notification_url: `${process.env.NEXT_PUBLIC_API_URL}/api/ipn/mercadopago`,
      },
    });

    return res.status(200).json({
      url: preference.init_point,
      orderId: order.id,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      (
        error.message === "Unauthorized" ||
        error.message === "No token provided"
      )
    ) {
      return res.status(401).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}