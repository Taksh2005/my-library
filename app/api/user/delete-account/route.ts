import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;
    if (!password) return NextResponse.json({ error: "Password required" }, { status: 400 });

    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { user_id: decoded.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ error: "Password incorrect" }, { status: 403 });

    // Transactional delete to clean dependent data first
    await prisma.$transaction([
      prisma.bookmark.deleteMany({ where: { user_id: user.user_id } }),
      prisma.bookRequest.deleteMany({ where: { user_id: user.user_id } }),
      // add any other dependent tables you have...
      prisma.user.delete({ where: { user_id: user.user_id } }),
    ]);

    // Clear auth cookie
    (await
          // Clear auth cookie
          cookies()).set("token", "", { httpOnly: true, path: "/", maxAge: 0 });

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
