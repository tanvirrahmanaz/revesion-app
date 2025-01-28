"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchSettings()
    }
  }, [status, router])

  const fetchSettings = async () => {
    const response = await fetch("/api/settings")
    if (response.ok) {
      const data = await response.json()
      setEmailEnabled(data.emailEnabled)
    }
  }

  const handleToggleEmail = async () => {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailEnabled: !emailEnabled }),
    })
    if (response.ok) {
      setEmailEnabled(!emailEnabled)
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="flex items-center">
        <input type="checkbox" id="emailToggle" checked={emailEnabled} onChange={handleToggleEmail} className="mr-2" />
        <label htmlFor="emailToggle">Receive daily email summaries</label>
      </div>
    </div>
  )
}

