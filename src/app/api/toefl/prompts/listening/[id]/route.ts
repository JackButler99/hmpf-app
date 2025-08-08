import { NextRequest, NextResponse } from 'next/server';
import ListeningPrompt from '@/models/Toefl_ListeningPrompt';
import { connectToDB } from '@/lib/mongodb';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  const prompt = await ListeningPrompt.findById(params.id);
  if (!prompt) return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
  return NextResponse.json({ prompt });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  const body = await req.json();
  const { title, audioUrl, instruction, transcript } = body;

  const prompt = await ListeningPrompt.findByIdAndUpdate(
    params.id,
    { title, audioUrl, instruction, transcript },
    { new: true }
  );

  if (!prompt) return NextResponse.json({ error: 'Update failed' }, { status: 400 });

  return NextResponse.json({ prompt });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  const result = await ListeningPrompt.findByIdAndDelete(params.id);
  if (!result) return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  return NextResponse.json({ success: true });
}
