// app/api/user/change-password/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

type JwtPayload = {
  id: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 },
      )
    }

    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 },
      )
    }

    let decoded: JwtPayload

    try {
      const verified = jwt.verify(token, JWT_SECRET)

      if (
        typeof verified === "string" ||
        typeof verified !== "object" ||
        verified === null ||
        !("id" in verified) ||
        typeof verified.id !== "number"
      ) {
        return NextResponse.json(
          { error: "Invalid token" },
          { status: 401 },
        )
      }

      decoded = {
        id: verified.id,
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 },
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        user_id: decoded.id,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      )
    }

    const ok = await bcrypt.compare(currentPassword, user.password)

    if (!ok) {
      return NextResponse.json(
        { error: "Current password incorrect" },
        { status: 403 },
      )
    }

    const hashed = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        password: hashed,
      },
    })

    const newToken = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    )

    const cookieStore = await cookies()

    cookieStore.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({
      success: true,
      message: "Password updated and new session issued",
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    )
  }
}