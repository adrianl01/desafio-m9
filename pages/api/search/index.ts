import type { NextApiRequest, NextApiResponse } from 'next';

import { getOffsetAndLimitFromReq } from '../../../lib/requests';

import { runMiddleware } from '../../../lib/corsMiddleware';

import { handleApiError } from '../../../lib/handleApiError';
import { searchProducts } from '../../../controllers/product';

export default async function search(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({
      message: 'Method Not Allowed'
    });
  }

  try {
    const { search } = req.query;

    if (!search || typeof search !== 'string') {
      throw new Error('Missing search query');
    }

    const { offset, limit } = getOffsetAndLimitFromReq(req);

    const data = await searchProducts(search, offset, limit);

    return res.status(200).json(data);
  } catch (error) {
    return handleApiError(res, error);
  }
}
