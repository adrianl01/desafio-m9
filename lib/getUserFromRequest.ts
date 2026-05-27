import { NextApiRequest } from "next";
import parseToken from "parse-bearer-token";

import { decode } from "./jwt";

interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

export async function getUserFromRequest(
  req: NextApiRequest
): Promise<DecodedToken> {
  const token = parseToken(req);

  if (!token) {
    throw new Error("No token provided");
  }

  const decodedToken = await decode(token);

  if (!decodedToken || typeof decodedToken === "string") {
    throw new Error("Unauthorized");
  }

  return decodedToken as DecodedToken;
}