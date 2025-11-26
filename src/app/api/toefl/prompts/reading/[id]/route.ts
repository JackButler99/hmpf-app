import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import ReadingPrompt from "@/models/Toefl_ReadingPrompt";

// ============================================================
// GET /api/toefl/prompts/reading/[id]
// ============================================================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ⬅ WAJIB promise
) {
  try {
    const { id } = await context.params;        // ⬅ WAJIB await

    await connectToDB();
    const prompt = await ReadingPrompt.findById(id).lean();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("GET Reading Prompt Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT /api/toefl/prompts/reading/[id]
// ============================================================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectToDB();
    const body = await req.json();
    const { title, passage, passageNumber } = body;

    // Validation
    if (!passage) {
      return NextResponse.json(
        { error: "Passage is required" },
        { status: 400 }
      );
    }

    if (
      passageNumber === undefined ||
      passageNumber === null ||
      passageNumber === ""
    ) {
      return NextResponse.json(
        { error: "Passage number is required" },
        { status: 400 }
      );
    }

    const updated = await ReadingPrompt.findByIdAndUpdate(
      id,
      { title, passage, passageNumber },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, prompt: updated });
  } catch (error) {
    console.error("PUT Reading Prompt Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/toefl/prompts/reading/[id]
// ============================================================
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectToDB();

    const result = await ReadingPrompt.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: "Delete failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Reading Prompt Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
