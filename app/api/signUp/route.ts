import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface SignUpRequestBody {
  name: string;
  contact: string;
  email: string;
  password: string;
  image: string;
}

export const POST = async (req: NextRequest, res: NextResponse) => {
  console.log('Request body:', req.body);
  const body = JSON.parse(JSON.stringify(req.body));
  const { name, contact, email, password, image } = body as SignUpRequestBody;
  console.log('Email:', email);
  console.log('Password:', password);

  if (!email || !password) {
    return new NextResponse(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return new NextResponse(JSON.stringify({ message: 'Email already in use' }), { status: 409 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        contact,
        image,
      },
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return new NextResponse(JSON.stringify({ message: 'Sign up successful', token, user: { email: newUser.email, id: newUser.id } }), { status: 201 });
  } catch (error) {
    console.error('Error signing up:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
};
