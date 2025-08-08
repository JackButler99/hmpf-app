import { NextRequest, NextResponse } from 'next/server';
import {connectToDB} from '@/lib/mongodb';
import ReadingPrompt from '@/models/Toefl_ReadingPrompt';
import ListeningPrompt from '@/models/Toefl_ListeningPrompt';

export async function POST(req: NextRequest) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section');
  const body = await req.json();

  const { title, passage, audioUrl, transcript, instruction } = body;

  if (section === 'reading') {
    if (!passage) {
      return NextResponse.json({ error: 'Passage is required' }, { status: 400 });
    }

    const prompt = new ReadingPrompt({ title, passage });
    await prompt.save();
    return NextResponse.json({ success: true, prompt });
  }

  if (section === 'listening') {
    if (!audioUrl) {
      return NextResponse.json({ error: 'Audio URL is required' }, { status: 400 });
    }

    const prompt = new ListeningPrompt({ title, audioUrl, transcript, instruction });
    await prompt.save();
    return NextResponse.json({ success: true, prompt });
  }

  return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
}


export async function GET(req: NextRequest) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section');

  if (section === 'reading') {
    const prompts = await ReadingPrompt.find().sort({ createdAt: -1 });
    return NextResponse.json({ prompts });
  }

  if (section === 'listening') {
    const prompts = await ListeningPrompt.find().sort({ createdAt: -1 });
    return NextResponse.json({ prompts });
  }

  return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
}
