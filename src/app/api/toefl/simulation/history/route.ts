import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Toefl_SimulationHistory from "@/models/Toefl_SimulationHistory";

/**
 * GET /api/toefl/simulation/history
 * Query params (opsional):
 * - userId=...        → filter per user
 * - mode=full|listening|structure|reading
 * - page=1&limit=20   → pagination ringan
 */
export async function GET(req: NextRequest) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || undefined;
  const mode    = searchParams.get("mode")   || undefined;

  const page  = Math.max(1, Number(searchParams.get("page")  || 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 50)));
  const skip  = (page - 1) * limit;

  const filter: Record<string, any> = {};
  if (userId) filter.userId = userId;
  if (mode)   filter.mode   = mode;

  const [rows, total] = await Promise.all([
    Toefl_SimulationHistory
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select({
        userId: 1,
        mode: 1,
        score: 1,        // { listening, structure, reading, total }
        createdAt: 1,
      })
      .lean(),
    Toefl_SimulationHistory.countDocuments(filter),
  ]);

  return NextResponse.json({
    histories: rows.map(r => ({
      _id: r._id.toString(),
      userId: r.userId,
      mode: r.mode,
      score: r.score,
      createdAt: r.createdAt,
    })),
    page,
    limit,
    total,
    hasMore: skip + rows.length < total,
  });
}
