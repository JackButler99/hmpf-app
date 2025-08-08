import { connectToDB } from '@/lib/mongodb';
import Lecturer from '@/models/Lecturer';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  if (search) {
    const lecturers = await Lecturer.find({
      name: { $regex: search, $options: 'i' }
    }).limit(10);

    return NextResponse.json(lecturers);
  }

  const total = await Lecturer.countDocuments();
  const lecturers = await Lecturer.find().skip(skip).limit(limit).sort({ name: 1 });

  return NextResponse.json({ data: lecturers, total });
}

export async function POST(req: Request) {
  await connectToDB();
  const body = await req.json();
  const { name, phone } = body;

  if (!name || !phone) {
    return NextResponse.json({ message: 'Name and phone are required' }, { status: 400 });
  }

  const newLecturer = await Lecturer.create({ name, phone });
  return NextResponse.json(newLecturer, { status: 201 });
}
