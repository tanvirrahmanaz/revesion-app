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
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) })

    return NextResponse.json({ emailEnabled: user.emailEnabled })
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while fetching settings" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { emailEnabled } = await req.json()
    const { db } = await connectToDatabase()

    await db.collection("users").updateOne({ _id: new ObjectId(session.user.id) }, { $set: { emailEnabled } })

    return NextResponse.json({ message: "Settings updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while updating settings" }, { status: 500 })
  }
}

