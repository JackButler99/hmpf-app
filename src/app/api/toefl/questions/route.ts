import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Toefl_Question from '@/models/Toefl_Question';

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();

  const { section, promptId, questionText, options, question_number, correctAnswer, explanation } = body;

  if (!section || !questionText || !options || options.length !== 4 || !correctAnswer) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  const question = new Toefl_Question({
    section,
    promptId: promptId || null,
    questionText,
    options,
    correctAnswer,
    question_number,
    explanation
  });

  await question.save();

  return NextResponse.json({ success: true, question });
}

export async function GET() {
  await connectToDB();
  const questions = await Toefl_Question.find().sort({ section: 1 });
  return NextResponse.json({ questions });
}
