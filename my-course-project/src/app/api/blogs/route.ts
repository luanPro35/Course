import { NextResponse } from "next/server";





export async function GET() {
  return NextResponse.json(
    { error: "Blog feature is not available - backend endpoint missing" },
    { status: 501 } 
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Blog feature is not available - backend endpoint missing" },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Blog feature is not available - backend endpoint missing" },
    { status: 501 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Blog feature is not available - backend endpoint missing" },
    { status: 501 }
  );
}
