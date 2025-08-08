// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

// GET all users
export async function GET() {
  await connectToDB();
  const users = await User.find();
  return NextResponse.json(users);
}

// PATCH: update user roles
export async function PATCH(req: Request) {
  const { id, isAdmin, isEditor } = await req.json();
  await connectToDB();
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { isAdmin, isEditor },
    { new: true }
  );
  return NextResponse.json(updatedUser);
}
