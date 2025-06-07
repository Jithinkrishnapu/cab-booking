"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface DashboardHeaderProps {
  user: any
  onLogout: () => void
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-yellow-400 p-2 rounded-md">
            <MapPin className="h-5 w-5 text-black" />
          </div>
          <h1 className="text-xl font-bold">AirportShare</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:text-yellow-500 transition-colors">
            Dashboard
          </Link>
          <Link href="/request-ride" className="text-sm font-medium hover:text-yellow-500 transition-colors">
            Request Ride
          </Link>
          <Link href="/find-matches" className="text-sm font-medium hover:text-yellow-500 transition-colors">
            Find Matches
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.name}</span>
          <Button variant="outline" size="sm" onClick={onLogout}>
            Log Out
          </Button>
        </div>
      </div>
    </header>
  )
}
