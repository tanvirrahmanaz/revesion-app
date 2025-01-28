import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const notes = await db
      .collection("notes")
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(notes)
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while fetching notes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await req.json()
    const { db } = await connectToDatabase()

    const result = await db.collection("notes").insertOne({
      userId: new ObjectId(session.user.id),
      content,
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Note created successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while creating the note" }, { status: 500 })
  }
}

