import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Toefl_SimulationHistory from "@/models/Toefl_SimulationHistory";
import Toefl_Question from "@/models/Toefl_Question";
import ReadingPrompt from "@/models/Toefl_ReadingPrompt";
import ListeningPrompt from "@/models/Toefl_ListeningPrompt";

/* ---------------------------------------------------------
   TYPE DEFINITIONS
--------------------------------------------------------- */
type HistoryRow = {
  questionId: string;
  section: "reading" | "listening" | "grammar" | "structure";
  promptId?: string | null;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
};

type QuestionDoc = {
  _id: any;
  questionText: string;
  options: string[];
  section: string;
  promptId?: any;
  question_number?: number | null;
};

type HistoryDocLean = {
  _id: any;
  userId: string;
  mode: string;
  score: number;
  createdAt: Date;
  questions: HistoryRow[];
};

/* ---------------------------------------------------------
   GET /api/toefl/simulation/history/[id]
--------------------------------------------------------- */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectToDB();

    const history = (await Toefl_SimulationHistory.findById(id).lean()) as
      | HistoryDocLean
      | null;

    if (!history) {
      return NextResponse.json({ error: "History not found" }, { status: 404 });
    }

    /* -----------------------------------------------------
       FETCH QUESTIONS
    ----------------------------------------------------- */
    const qids = (history.questions as HistoryRow[]).map((q) => q.questionId);

    // 🔥 FIX: double cast untuk lean()
    const qdocs = (await Toefl_Question.find({
      _id: { $in: qids },
    }).lean()) as unknown as QuestionDoc[];

    const qMap: Map<string, QuestionDoc> = new Map(
      qdocs.map((q) => [q._id.toString(), q])
    );

    const items = (history.questions as HistoryRow[]).map((row) => {
      const qdoc = qMap.get(String(row.questionId));

      return {
        questionId: String(row.questionId),
        section: row.section === "grammar" ? "structure" : row.section,
        promptId: row.promptId ? String(row.promptId) : null,
        userAnswer: row.userAnswer,
        correctAnswer: row.correctAnswer,
        isCorrect: row.isCorrect,
        explanation: row.explanation || "",
        questionText: qdoc?.questionText || "",
        options: qdoc?.options || [],
        question_number: qdoc?.question_number ?? null,
      };
    });

    /* -----------------------------------------------------
       COLLECT PROMPTS
    ----------------------------------------------------- */
    const promptIds = Array.from(
      new Set(items.map((i) => i.promptId).filter(Boolean))
    ) as string[];

    const readingIds = promptIds.filter((pid) =>
      items.some((i) => i.promptId === pid && i.section === "reading")
    );

    const listeningIds = promptIds.filter((pid) =>
      items.some((i) => i.promptId === pid && i.section === "listening")
    );

    const [readingPrompts, listeningPrompts] = (await Promise.all([
      ReadingPrompt.find({ _id: { $in: readingIds } }).lean(),
      ListeningPrompt.find({ _id: { $in: listeningIds } }).lean(),
    ])) as [any[], any[]];

    const prompts: Record<string, any> = {};

    for (const rp of readingPrompts) {
      prompts[String(rp._id)] = {
        _id: String(rp._id),
        type: "reading",
        passage: rp.passage ?? "",
      };
    }

    for (const lp of listeningPrompts) {
      prompts[String(lp._id)] = {
        _id: String(lp._id),
        type: "listening",
        audioUrl: lp.audioUrl ?? "",
        transcript: lp.transcript ?? "",
      };
    }

    /* -----------------------------------------------------
       RETURN
    ----------------------------------------------------- */
    return NextResponse.json({
      success: true,
      history: {
        _id: String(history._id),
        userId: history.userId,
        mode: history.mode,
        score: history.score,
        createdAt: history.createdAt,
      },
      items,
      questions: items,
      prompts,
    });
  } catch (err) {
    console.error("History GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
