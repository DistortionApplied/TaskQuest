import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/user - Get current user (assuming single user for now)
export async function GET() {
  try {
    const user = await db.select().from(users).where(eq(users.id, 1)).limit(1);

    if (user.length === 0) {
      // Create default user if none exists
      const newUser = await db.insert(users).values({
        name: "Player",
        xp: 0,
        level: 1,
      }).returning();

      return NextResponse.json(newUser[0]);
    }

    return NextResponse.json(user[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// PUT /api/user - Update user XP/Level
export async function PUT(request: Request) {
  try {
    const { xp, level } = await request.json();

    const updatedUser = await db
      .update(users)
      .set({ xp, level })
      .where(eq(users.id, 1))
      .returning();

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}