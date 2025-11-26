import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import ReadingPrompt from '@/models/Toefl_ReadingPrompt';
import ListeningPrompt from '@/models/Toefl_ListeningPrompt';
import Toefl_Question from '@/models/Toefl_Question'; // ⭐ Added for questionCount

export async function POST(req: NextRequest) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section');
  const body = await req.json();

  const {
    title,
    passage,
    passageNumber,
    audioUrl,
    transcript,
    instruction,
  } = body;

  // ----------------------------------------------------
  // READING PROMPT
  // ----------------------------------------------------
  if (section === 'reading') {
    if (!passage) {
      return NextResponse.json(
        { error: 'Passage is required' },
        { status: 400 }
      );
    }

    if (
      passageNumber === undefined ||
      passageNumber === null ||
      passageNumber === ""
    ) {
      return NextResponse.json(
        { error: 'Passage number is required' },
        { status: 400 }
      );
    }

    const prompt = new ReadingPrompt({
      title,
      passage,
      passageNumber,
      section: 'reading',
    });

    await prompt.save();

    return NextResponse.json({ success: true, prompt });
  }

  // ----------------------------------------------------
  // LISTENING PROMPT
  // ----------------------------------------------------
  if (section === 'listening') {
    if (!audioUrl) {
      return NextResponse.json(
        { error: 'Audio URL is required' },
        { status: 400 }
      );
    }

    const prompt = new ListeningPrompt({
      title,
      audioUrl,
      transcript,
      instruction,
      section: 'listening',
    });

    await prompt.save();

    return NextResponse.json({ success: true, prompt });
  }

  return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
}

// ----------------------------------------------------
// GET all prompts by section
// ----------------------------------------------------
export async function GET(req: NextRequest) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section');

  // ----------------------------------------------------
  // ⭐ UPDATED → READING PROMPTS WITH QUESTION COUNT
  // ----------------------------------------------------
  if (section === 'reading') {
    const prompts = await ReadingPrompt.find().sort({ passageNumber: 1 });

    const promptsWithCount = await Promise.all(
      prompts.map(async (p) => {
        const count = await Toefl_Question.countDocuments({
          promptId: p._id,
          section: 'reading',
        });

        return {
          ...p.toObject(),
          questionCount: count,
        };
      })
    );

    return NextResponse.json({ prompts: promptsWithCount });
  }

  // ----------------------------------------------------
  // LISTENING (unchanged)
  // ----------------------------------------------------
  if (section === 'listening') {
    const prompts = await ListeningPrompt.find().sort({ createdAt: -1 });
    return NextResponse.json({ prompts });
  }

  return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
}
