import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import ReadingPrompt from '@/models/Toefl_ReadingPrompt';

// --------------------------------------------------------
// GET /api/toefl/prompts/reading/[id]
// --------------------------------------------------------
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectToDB();

  const prompt = await ReadingPrompt.findById(id);
  if (!prompt) {
    return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
  }

  return NextResponse.json({ prompt });
}

// --------------------------------------------------------
// PUT /api/toefl/prompts/reading/[id]
// --------------------------------------------------------
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectToDB();

  const body = await req.json();

  // Validate mandatory fields
  if (!body.passage) {
    return NextResponse.json(
      { error: 'Passage is required' },
      { status: 400 }
    );
  }

  if (body.passageNumber ===undefined || body.passageNumber===null || body.passageNumber==='' ) {
    return NextResponse.json(
      { error: 'Passage number is required' },
      { status: 400 }
    );
  }

  // Update fields
  const updated = await ReadingPrompt.findByIdAndUpdate(
    id,
    {
      title: body.title,
      passage: body.passage,
      passageNumber: body.passageNumber, 
    },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, prompt: updated });
}

// --------------------------------------------------------
// DELETE /api/toefl/prompts/reading/[id]
// --------------------------------------------------------
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectToDB();

  const result = await ReadingPrompt.findByIdAndDelete(id);
  if (!result) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
