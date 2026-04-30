import { NextResponse } from "next/server";
import { getUserById, updateUser } from "@/lib/data";

// GET /api/user - Get current user (assuming single user for now)
export async function GET() {
  try {
    const user = await getUserById(1);

    if (!user) {
      // This shouldn't happen since we have a default user in users.json
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// PUT /api/user - Update user XP/Level
export async function PUT(request: Request) {
  try {
    const { xp, level } = await request.json();

    const currentUser = await getUserById(1);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = { ...currentUser, xp, level };
    await updateUser(updatedUser);

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}