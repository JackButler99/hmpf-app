import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Lecturer from "@/models/Lecturer";

export async function PUT(req: NextRequest, { params }: any) {
  await connectToDB();

  const body = await req.json();
  const { name, phones, research_fields } = body;

  const updated = await Lecturer.findByIdAndUpdate(
    params.id,
    {
      name,
      phones: phones || [],
      research_fields: research_fields || [],
    },
    { new: true }
  );

  return NextResponse.json({ message: "Updated", lecturer: updated });
}

export async function DELETE(_: NextRequest, { params }: any) {
  await connectToDB();

  await Lecturer.findByIdAndDelete(params.id);

  return NextResponse.json({ message: "Deleted" });
}
