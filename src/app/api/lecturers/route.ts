// /app/api/lecturers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Lecturer from "@/models/Lecturer";

export const dynamic = "force-dynamic";

/* ============================================================
   GET — SEARCH or FETCH ALL (PAGINATED)
   ============================================================ */
export async function GET(req: NextRequest) {
  await connectToDB();

  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const limit = Math.min(Number(searchParams.get("limit") || 10), 50);
  const skip = (page - 1) * limit;

  const filter =
    q.length >= 2
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { research_fields: { $regex: q, $options: "i" } }, // match array
          ],
        }
      : {};

  const [items, total] = await Promise.all([
    Lecturer.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Lecturer.countDocuments(filter),
  ]);

  return NextResponse.json({
    page,
    limit,
    total,
    items,
  });
}

/* ============================================================
   POST — CREATE NEW LECTURER
   ============================================================ */
export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const { name, phones, research_fields } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const newLecturer = await Lecturer.create({
      name,
      phones: Array.isArray(phones) ? phones : [],
      research_fields: Array.isArray(research_fields)
        ? research_fields
        : [],
    });

    return NextResponse.json(
      { message: "Lecturer created", lecturer: newLecturer },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /lecturers error:", err);
    return NextResponse.json(
      { error: "Failed to create lecturer" },
      { status: 500 }
    );
  }
}
