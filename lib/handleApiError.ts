import { NextApiResponse } from "next";

export function handleApiError(
  res: NextApiResponse,
  error: unknown
) {
  console.error(error);

  if (error instanceof Error) {
    // AUTH
    if (
      error.message === "Unauthorized" ||
      error.message === "No token provided"
    ) {
      return res.status(401).json({
        message: error.message,
      });
    }

    // NOT FOUND
    if (
      error.message === "User not found" ||
      error.message === "Order not found" ||
      error.message === "Product not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    // FORBIDDEN
    if (error.message === "Forbidden") {
      return res.status(403).json({
        message: error.message,
      });
    }

    // BAD REQUEST
    if (
      error.message === "Invalid data" ||
      error.message === "Missing productId" ||
      error.message === "Missing address" ||
      error.message === "Missing search query"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  return res.status(500).json({
    message: "Internal server error",
  });
}