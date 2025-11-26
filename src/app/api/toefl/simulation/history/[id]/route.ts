import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Toefl_SimulationHistory from "@/models/Toefl_SimulationHistory";
import Toefl_Question from "@/models/Toefl_Question";
import ReadingPrompt from "@/models/Toefl_ReadingPrompt";
import ListeningPrompt from "@/models/Toefl_ListeningPrompt";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectToDB();

    const { id } = params;

    const history = await Toefl_SimulationHistory.findById(id).lean();
    if (!history) {
      return NextResponse.json({ error: "History not found" }, { status: 404 });
    }

    // -----------------------------------------------
    // FETCH ALL QUESTION DOCUMENTS
    // -----------------------------------------------
    const qids = history.questions.map((q: any) => q.questionId);
    const qdocs = await Toefl_Question.find({ _id: { $in: qids } }).lean();

    const qMap = new Map(qdocs.map((q: any) => [q._id.toString(), q]));

    // -----------------------------------------------
    // BUILD REVIEW ITEMS
    // -----------------------------------------------
    const items = history.questions.map((row: any) => {
      const qdoc = qMap.get(row.questionId.toString());

      return {
        questionId: row.questionId.toString(),
        section: row.section === "grammar" ? "structure" : row.section,
        promptId: row.promptId ? row.promptId.toString() : null,
        userAnswer: row.userAnswer,
        correctAnswer: row.correctAnswer,
        isCorrect: row.isCorrect,
        explanation: row.explanation || "",
        questionText: qdoc?.questionText || "",
        options: qdoc?.options || [],
        question_number: qdoc?.question_number ?? null,
      };
    });

    // -----------------------------------------------
    // COLLECT ALL PROMPT IDs
    // -----------------------------------------------
    const promptIds = Array.from(
      new Set(items.map((i: any) => i.promptId).filter(Boolean))
    );

    // Determine reading/listening prompt usage
    const readingIds = promptIds.filter((pid) =>
      items.some((i) => i.promptId === pid && i.section === "reading")
    );

    const listeningIds = promptIds.filter((pid) =>
      items.some((i) => i.promptId === pid && i.section === "listening")
    );

    const [readingPrompts, listeningPrompts] = await Promise.all([
      ReadingPrompt.find({ _id: { $in: readingIds } }).lean(),
      ListeningPrompt.find({ _id: { $in: listeningIds } }).lean(),
    ]);

    // -----------------------------------------------
    // BUILD PROMPT MAP
    // -----------------------------------------------
    const prompts: Record<string, any> = {};

    for (const rp of readingPrompts) {
      prompts[rp._id.toString()] = {
        _id: rp._id.toString(),
        type: "reading",
        passage: rp.passage || "",
      };
    }

    for (const lp of listeningPrompts) {
      prompts[lp._id.toString()] = {
        _id: lp._id.toString(),
        type: "listening",
        passage: lp.passage || "",
        audioUrl: lp.audioUrl || "",
      };
    }

    // -----------------------------------------------
    // RETURN FINAL SHAPE (COMPATIBLE WITH REVIEW PAGE)
    // -----------------------------------------------
    return NextResponse.json({
      success: true,
      history: {
        _id: history._id.toString(),
        userId: history.userId,
        mode: history.mode,
        score: history.score,
        createdAt: history.createdAt,
      },

      items,
      questions: items, // 🔥 alias untuk backward compatibility

      prompts,
    });

  } catch (err) {
    console.error("History GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
