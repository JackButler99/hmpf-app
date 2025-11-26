import { NextRequest, NextResponse } from "next/server";
import ListeningPrompt from "@/models/Toefl_ListeningPrompt";
import { connectToDB } from "@/lib/mongodb";

// ======================================================
// GET
// ======================================================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }   // ⬅ WAJIB promise
) {
  try {
    const { id } = await context.params;          // ⬅ WAJIB di-await

    await connectToDB();
    const prompt = await ListeningPrompt.findById(id).lean();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("GET Listening Prompt Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ======================================================
// PUT
// ======================================================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectToDB();
    const body = await req.json();

    const { title, audioUrl, instruction, transcript } = body;

    const prompt = await ListeningPrompt.findByIdAndUpdate(
      id,
      { title, audioUrl, instruction, transcript },
      { new: true }
    );

    if (!prompt) {
      return NextResponse.json(
        { error: "Update failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("PUT Listening Prompt Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE
// ======================================================
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectToDB();

    const result = await ListeningPrompt.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: "Delete failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Listening Prompt Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
