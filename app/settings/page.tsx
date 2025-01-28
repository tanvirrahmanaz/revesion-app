"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchSettings();
    }
  }, [status, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setEmailEnabled(data.emailEnabled);
      } else {
        console.error("Failed to fetch settings.");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEmail = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailEnabled: !emailEnabled }),
      });

      if (response.ok) {
        setEmailEnabled(!emailEnabled);
      } else {
        console.error("Failed to update settings.");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="emailToggle"
          checked={emailEnabled}
          onChange={handleToggleEmail}
          className="mr-2"
        />
        <label htmlFor="emailToggle" className="cursor-pointer">
          Receive daily email summaries
        </label>
      </div>
    </div>
  );
}
