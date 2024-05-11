import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const { sub: googleId, email, name, picture } = payload;

    let user = await prisma.user.findUnique({
      where: {
        googleId,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId,
          email,
          name,
          picture,
        },
      });
    }

    const jwtToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Google sign in successful', token: jwtToken, user });
  } catch (error) {
    console.error('Error with Google sign in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
