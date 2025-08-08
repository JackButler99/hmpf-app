import { NextResponse } from 'next/server';
import {connectToDB} from '@/lib/mongodb';
import Question from '@/models/Toefl_Question';
import ReadingPrompt from '@/models/Toefl_ReadingPrompt';
import ListeningPrompt from '@/models/Toefl_ListeningPrompt';

export async function GET() {
  await connectToDB();

  const [readingQ, listeningQ, grammarQ, readingP, listeningP] = await Promise.all([
    Question.countDocuments({ section: 'reading' }),
    Question.countDocuments({ section: 'listening' }),
    Question.countDocuments({ section: 'grammar' }),
    ReadingPrompt.countDocuments(),
    ListeningPrompt.countDocuments()
  ]);

  return NextResponse.json({
    reading_questions: readingQ,
    listening_questions: listeningQ,
    grammar_questions: grammarQ,
    reading_prompts: readingP,
    listening_prompts: listeningP
  });
}
