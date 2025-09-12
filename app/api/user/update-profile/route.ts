// app/api/user/update-profile/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firstname, lastname, email, username } = data;

    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const updated = await prisma.user.update({
      where: { user_id: decoded.id },
      data: { firstname, lastname, email, username },
    });

    return NextResponse.json({ success: true, user: { firstname: updated.firstname, lastname: updated.lastname, email: updated.email, username: updated.username } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
