import type { NextApiRequest } from "next";

export function getOffsetAndLimitFromReq(
  req: NextApiRequest,
  maxLimit = 100,
  maxOffset = 1000
) {
  const parsedLimit = Number(req.query.limit);

  const parsedOffset = Number(req.query.offset);

  let limit = 10;

  if (
    !Number.isNaN(parsedLimit) &&
    parsedLimit > 0
  ) {
    limit = Math.min(parsedLimit, maxLimit);
  }

  let offset = 0;

  if (
    !Number.isNaN(parsedOffset) &&
    parsedOffset >= 0
  ) {
    offset = Math.min(parsedOffset, maxOffset);
  }

  return {
    limit,
    offset,
  };
}