import type { NextApiRequest, NextApiResponse } from 'next';
import { compareAsc } from 'date-fns';

import { generate } from '../../../lib/jwt';
import { Auth } from '../../../models/auth';
import { runMiddleware } from '../../../lib/corsMiddleware';

export default async function token(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: 'Missing email or code' });
    }

    const auth = await Auth.findByEmail(email);
    if (!auth) {
      return res.status(404).json({ message: 'Auth not found' });
    }

    const parsedCode = Number(code);
    if (parsedCode !== auth.data.code) {
      console.log('token incorrecto:', parsedCode);

      return res.status(401).json({ message: 'Wrong Token' });
    }

    if (!auth.data.validCode) {
      return res.status(401).json({ message: 'Invalid Token' });
    }

    const expirationDate = auth.data.expires.toDate ? auth.data.expires.toDate() : new Date(auth.data.expires);
    const currentDate = new Date();
    const expDate = compareAsc(expirationDate, currentDate);
    if (expDate === -1) {
      return res.status(401).json({ message: 'Expired Token' });
    }

    // invalidar código luego de usarlo
    auth.data.validCode = false;
    await auth.push();
    const token = generate({ userId: auth.data.userId });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
