import { NextRequest, NextResponse } from "next/server";
import { getLabForCategory, LABS } from "@/app/data/labs";

export async function POST(req: NextRequest) {
  const { category, topic } = await req.json();

  // Pick a lab — if topic matches a specific keyword, try to find a relevant one
  const categoryLabs = LABS[category];
  let lab = getLabForCategory(category);

  if (topic && categoryLabs && categoryLabs.length > 1) {
    const lower = topic.toLowerCase();
    const match = categoryLabs.find((l) =>
      l.title.toLowerCase().includes(lower) ||
      l.objective.toLowerCase().includes(lower)
    );
    if (match) lab = match;
  }

  return NextResponse.json({ lab });
}
