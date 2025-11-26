import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Question from "@/models/Toefl_Question";

// ============================================================
// GET /api/toefl/questions/[id]
// ============================================================
export async function GET(
  req: NextRequest,
  {params}: {params: {id: string}}
) {
  try {
    const { id } = params;

    await connectToDB();
    const question = await Question.findById(id).lean();

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error("GET Question Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT /api/toefl/questions/[id]
// ============================================================
export async function PUT(
  req: NextRequest,
  {params}: {params: {id: string}}
) {
  try {
    const { id } = params;
    await connectToDB();

    const body = await req.json();

    const updateFields: Record<string, any> = {
      section: body.section,
      questionText: body.questionText,
      options: body.options,
      correctAnswer: body.correctAnswer,
      explanation: body.explanation,
      promptId: body.promptId || null,
    };

    // Listening question has question_number
    if (body.section === "listening") {
      updateFields.question_number = body.question_number;
    } else {
      updateFields.question_number = undefined;
    }

    const updated = await Question.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, question: updated });
  } catch (error) {
    console.error("PUT Question Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/toefl/questions/[id]
// ============================================================
export async function DELETE(
  req: NextRequest,
  {params}: {params: {id: string}}
) {
  try {
    const { id } = params;

    await connectToDB();
    const result = await Question.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: "Delete failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Question Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
