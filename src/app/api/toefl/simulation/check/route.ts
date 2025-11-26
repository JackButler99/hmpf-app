import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import SimulationSession from "@/models/SimulationSession";

type SessionType = {
  _id: string;
  userId: string;
  mode: string;
  expiresAt?: Date;
};

export async function POST(req: Request) {
  await connectToDB();
  const { userId, mode } = await req.json();

  // Force the document into correct type
  const session = (await SimulationSession.findOne({ userId, mode }).lean()) as
    | SessionType
    | null;

  // Tidak ada session → dianggap tidak exist
  if (!session) {
    return NextResponse.json({ exists: false });
  }

  const now = Date.now();
  const expired =
    session.expiresAt &&
    new Date(session.expiresAt).getTime() < now;

  // Jika expired → delete + exists: false
  if (expired) {
    await SimulationSession.deleteOne({ userId, mode });
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({ exists: true });
}
