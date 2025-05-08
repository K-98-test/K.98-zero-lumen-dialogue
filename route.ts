import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    username: "기정",
    code: "K.98",
    is_exception_user: true,
    persona: "Zero.k"
  });
}
