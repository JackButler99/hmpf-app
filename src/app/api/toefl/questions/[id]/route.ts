import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Question from '@/models/Toefl_Question';

// --------------------------------------------------------
// GET /api/toefl/questions/[id]
// --------------------------------------------------------
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ⬅ params as Promise
) {
  const { id } = await context.params; // ⬅ harus di-await
  await connectToDB();

  const question = await Question.findById(id);
  if (!question) {
    return NextResponse.json(
      { error: 'Soal tidak ditemukan' },
      { status: 404 }
    );
  }

  return NextResponse.json({ question });
}

// --------------------------------------------------------
// PUT /api/toefl/questions/[id]
// --------------------------------------------------------
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ⬅ di-await
  await connectToDB();

  const body = await req.json();

  // Silakan sesuaikan field2 ini dengan schema kamu
  const updateFields: any = {
    section: body.section,
    questionText: body.questionText,
    options: body.options,
    correctAnswer: body.correctAnswer,
    explanation: body.explanation,
    promptId: body.promptId || null,
  };

  // Hanya listening yang punya question_number
  if (body.section === 'listening') {
    updateFields.question_number = body.question_number;
  } else {
    updateFields.question_number = undefined;
  }

  const updated = await Question.findByIdAndUpdate(id, updateFields, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json(
      { error: 'Soal tidak ditemukan' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, question: updated });
}

// --------------------------------------------------------
// DELETE /api/toefl/questions/[id]
// --------------------------------------------------------
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ⬅ di-await
  await connectToDB();

  const result = await Question.findByIdAndDelete(id);
  if (!result) {
    return NextResponse.json(
      { error: 'Gagal menghapus soal' },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
