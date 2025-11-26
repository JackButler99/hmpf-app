import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Toefl_Question from "@/models/Toefl_Question";
import Toefl_SimulationHistory from "@/models/Toefl_SimulationHistory";

/* === Fix: definisikan tipe aman untuk hasil lean() === */
type QuestionDoc = {
  _id: any;
  section: string;
  correctAnswer: string;
  explanation?: string;
};

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { userId, mode, answers } = await req.json();

    if (!userId || !mode || !answers) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    /* -----------------------------------------------
       LOAD QUESTIONS
    ------------------------------------------------- */
    const questionIds = answers.map((a: any) => a.questionId);

    const dbQuestions = (await Toefl_Question.find({
      _id: { $in: questionIds },
    }).lean()) as unknown as QuestionDoc[];

    const lookup = new Map<string, QuestionDoc>(
      dbQuestions.map((q) => [String(q._id), q])
    );

    /* -----------------------------------------------
       CALCULATE SCORES
    ------------------------------------------------- */
    let listening = 0,
      structure = 0,
      reading = 0;

    const detailed = answers
      .map((entry: any) => {
        const q = lookup.get(String(entry.questionId));
        if (!q) return null;

        const correct = q.correctAnswer === entry.userAnswer;

        if (q.section === "listening" && correct) listening++;
        if ((q.section === "grammar" || q.section === "structure") && correct)
          structure++;
        if (q.section === "reading" && correct) reading++;

        return {
          questionId: q._id,
          promptId: entry.promptId,
          section: q.section,
          userAnswer: entry.userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect: correct,
          explanation: q.explanation || "",
        };
      })
      .filter(Boolean);

    /* -----------------------------------------------
       SAVE HISTORY
    ------------------------------------------------- */
    const history = await Toefl_SimulationHistory.create({
      userId,
      mode,
      score: {
        listening,
        structure,
        reading,
        total: listening + structure + reading,
      },
      questions: detailed,
    });

    return NextResponse.json({ success: true, historyId: history._id });
  } catch (err) {
    console.error("Simulation POST error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
