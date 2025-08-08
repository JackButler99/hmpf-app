import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Question from '@/models/Toefl_Question';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDB();
  const question = await Question.findByIdAndDelete(params.id);
  if (!question) {
    return NextResponse.json({ error: 'Soal tidak ditemukan' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDB();
  const question = await Question.findById(params.id);
  if (!question) {
    return NextResponse.json({ error: 'Soal tidak ditemukan' }, { status: 404 });
  }
  return NextResponse.json({ question });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDB();
  const body = await req.json();

  const updated = await Question.findByIdAndUpdate(params.id, body, { new: true });
  if (!updated) {
    return NextResponse.json({ error: 'Soal tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({ success: true, question: updated });
}
