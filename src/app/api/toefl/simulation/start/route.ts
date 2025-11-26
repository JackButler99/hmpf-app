import { NextResponse } from "next/server";
import {connectToDB} from "@/lib/mongodb"
import SimulationSession from "@/models/SimulationSession";

export async function POST(req: Request) {
  await connectToDB();
  const { userId, mode } = await req.json();

  let session = await SimulationSession.findOne({ userId, mode });

  if (!session) {
    session = await SimulationSession.create({
      userId,
      mode,
      answers: {},
      currentQuestion: 0,
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
    });
  }

  return NextResponse.json(session);
}
