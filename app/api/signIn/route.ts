import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const POST = async (req: NextRequest, res: NextResponse) => {
  console.log('signIn');
  const data = await (req.json());
  const { email, password } = data;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return new NextResponse(JSON.stringify({ message: 'Sign in successful', token, user: { email: user.email, id: user.id } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error signing in:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
