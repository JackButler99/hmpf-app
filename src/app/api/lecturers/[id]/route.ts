import { connectToDB } from '@/lib/mongodb';
import Lecturer from '@/models/Lecturer';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDB();
  const body = await req.json();

  const updated = await Lecturer.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDB();

  await Lecturer.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Lecturer deleted' });
}
