import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Insert new user
    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      emailEnabled: true,
    })

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while creating the user" }, { status: 500 })
  }
}

