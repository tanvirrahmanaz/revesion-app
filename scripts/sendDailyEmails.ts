import { connectToDatabase } from "../lib/mongodb"
import nodemailer from "nodemailer"

async function sendDailyEmails() {
  const { db } = await connectToDatabase()

  // Get all users with email enabled
  const users = await db.collection("users").find({ emailEnabled: true }).toArray()

  for (const user of users) {
    // Get today's notes for the user
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const notes = await db
      .collection("notes")
      .find({
        userId: user._id,
        createdAt: { $gte: today },
      })
      .toArray()

    if (notes.length > 0) {
      // Create email content
      const emailContent = `
        <h1>Your Daily Notes Summary</h1>
        <ul>
          ${notes.map((note) => `<li>${note.content}</li>`).join("")}
        </ul>
      `

      // Send email
      const transporter = nodemailer.createTransport({
        // Configure your email service here
      })

      await transporter.sendMail({
        from: "your-app@example.com",
        to: user.email,
        subject: "Daily Notes Summary",
        html: emailContent,
      })
    }
  }
}

sendDailyEmails()

