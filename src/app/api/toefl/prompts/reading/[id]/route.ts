import { NextRequest, NextResponse } from 'next/server';
import {connectToDB} from '@/lib/mongodb';
import ReadingPrompt from '@/models/Toefl_ReadingPrompt';
import ListeningPrompt from '@/models/Toefl_ListeningPrompt';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDB();
  const prompt = await ReadingPrompt.findById(params.id);
  if (!prompt) {
    return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
  }
  return NextResponse.json({ prompt });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDB();
  const body = await req.json();

  if (body.section === 'reading') {
    const updated = await ReadingPrompt.findByIdAndUpdate(params.id, {
      title: body.title,
      passage: body.passage,
    }, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, prompt: updated });
  }

  return NextResponse.json({ error: 'Unsupported section' }, { status: 400 });
}
