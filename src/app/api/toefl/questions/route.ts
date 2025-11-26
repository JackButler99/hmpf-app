import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Toefl_Question from "@/models/Toefl_Question";
import { sim_config } from "@/config/toefl/sim_config";

/* -----------------------------------------------------------
 * Helper functions
 * --------------------------------------------------------- */
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type RawQ = {
  _id: any;
  section: "reading" | "listening" | "grammar" | "structure";
  promptId?: any;
  questionText: string;
  options: string[];
  correctAnswer?: string;
  explanation?: string;
  question_number?: number | null;
};

function groupByPrompt(list: RawQ[]) {
  const map = new Map<string, RawQ[]>();
  for (const q of list) {
    const key = q.promptId ? String(q.promptId) : "null";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(q);
  }
  return map;
}

function sanitize(q: RawQ) {
  return {
    _id: String(q._id),
    section: q.section === "grammar" ? "structure" : q.section,
    promptId: q.promptId ? String(q.promptId) : null,
    questionText: q.questionText,
    options: q.options,
    question_number: q.question_number ?? null,
  };
}

/* ============================================================
   CREATE QUESTION (ADMIN)
============================================================ */
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();

    const {
      section,
      promptId,
      questionText,
      options,
      question_number,
      correctAnswer,
      explanation,
    } = body;

    if (!section || !questionText || !options || options.length !== 4 || !correctAnswer) {
      return NextResponse.json({ error: "Incomplete data" }, { status: 400 });
    }

    const doc = new Toefl_Question({
      section,
      promptId: promptId || null,
      questionText,
      options,
      correctAnswer,
      question_number: question_number ?? null,
      explanation: explanation || "",
    });

    await doc.save();

    return NextResponse.json({ success: true, question: doc });
  } catch (err) {
    console.error("Error creating question:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ============================================================
   GET — MULTI-MODE (admin, listening-package, reading, structure, full)
============================================================ */
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const mode = req.nextUrl.searchParams.get("mode") || "full";

    /* --------------------------------------------------------
     * MODE A — ADMIN MODE
     * ------------------------------------------------------ */
    if (mode === "admin") {
      const full = await Toefl_Question.find().sort({ createdAt: -1 });
      return NextResponse.json({ questions: full });
    }

    /* --------------------------------------------------------
     * MODE B — LISTENING PACKAGE
     * ------------------------------------------------------ */
    if (mode === "listening-package") {
      const packageId = req.nextUrl.searchParams.get("packageId");

      if (!packageId) {
        return NextResponse.json({ error: "packageId required" }, { status: 400 });
      }

      const qs: RawQ[] = await Toefl_Question.find({
        section: "listening",
        promptId: packageId,
      })
        .sort({ question_number: 1 })
        .lean();

      return NextResponse.json({ questions: qs.map(sanitize) });
    }

    /* --------------------------------------------------------
     * MODE C — READING PACKAGE (1 passage saja)
     * ------------------------------------------------------ */
    if (mode === "reading") {
      const promptId = req.nextUrl.searchParams.get("promptId");

      if (!promptId) {
        return NextResponse.json({ error: "promptId required" }, { status: 400 });
      }

      const qs = await Toefl_Question.find({
        section: "reading",
        promptId,
      })
        .sort({ question_number: 1 })
        .lean();

      return NextResponse.json({ questions: qs.map(sanitize) });
    }

    /* --------------------------------------------------------
     * MODE D — STRUCTURE ONLY (NEW!) 
     * ------------------------------------------------------ */
    if (mode === "structure") {
      const all = await Toefl_Question.find().lean();

      const structureAll = all.filter(
        (q) => q.section === "grammar" || q.section === "structure"
      );

      const picked = shuffle(structureAll).slice(0, 40);

      return NextResponse.json({ questions: picked.map(sanitize) });
    }

    /* --------------------------------------------------------
     * MODE E — FULL SIMULATION (DEFAULT)
     * ------------------------------------------------------ */
    const cfg = sim_config.full;
    const all: RawQ[] = await Toefl_Question.find().lean();

    const listeningAll = all.filter((q) => q.section === "listening");
    const readingAll = all.filter((q) => q.section === "reading");
    const structureAll = all.filter(
      (q) => q.section === "grammar" || q.section === "structure"
    );

    /* -------- LISTENING -------- */
    const listeningSorted = listeningAll.slice().sort((a, b) => {
      if (String(a.promptId) === String(b.promptId)) {
        return (a.question_number ?? 999) - (b.question_number ?? 999);
      }
      return 0;
    });

    const listeningGroups = Array.from(groupByPrompt(listeningSorted).values()).filter(
      (arr) => arr[0].promptId
    );

    const listeningPicked = shuffle(listeningGroups)
      .slice(0, cfg.listeningPrompts)
      .flat();

    /* -------- READING -------- */
    const readingSorted = readingAll.slice().sort((a, b) => {
      if (String(a.promptId) === String(b.promptId)) {
        return (a.question_number ?? 999) - (b.question_number ?? 999);
      }
      return 0;
    });

    const readingGroups = Array.from(groupByPrompt(readingSorted).values()).filter(
      (arr) => arr[0].promptId
    );

    const readingPicked = shuffle(readingGroups)
      .slice(0, cfg.readingPassages)
      .flat();

    /* -------- STRUCTURE -------- */
    const structurePicked = shuffle(structureAll).slice(0, cfg.structureQuestions);

    /* -------- MERGE FINAL -------- */
    const finalTest = [
      ...listeningPicked,
      ...structurePicked,
      ...readingPicked,
    ];

    return NextResponse.json({ questions: finalTest.map(sanitize) });

  } catch (err) {
    console.error("GET questions error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
