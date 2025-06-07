"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, User, Users } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import type { Trip } from "@/lib/types"
import { getAllTrips, updateTripStatus } from "@/lib/data"

export default function FindMatchesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [availableTrips, setAvailableTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Get user data
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Get all available trips (excluding user's own trips)
    const userData2 = JSON.parse(localStorage.getItem("user") || "{}")
    const trips = getAllTrips().filter((trip) => trip.userId !== userData2.id && trip.status === "pending")
    setAvailableTrips(trips)
    setIsLoading(false)
  }, [router])

  const handleJoinTrip = (tripId: string) => {
    setIsJoining(tripId)

    // Simulate API call
    setTimeout(() => {
      const updatedTrip = updateTripStatus(tripId, "active", user.name)
      router.push(`/trips/${updatedTrip.id}`)
    }, 1500)
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-500">Finding available matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium mb-8 hover:text-yellow-500 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Find Ride Matches</h1>
          <p className="text-gray-500 mb-8">Browse available trips that match your destination and schedule</p>

          {availableTrips.length > 0 ? (
            <div className="space-y-6">
              {availableTrips.map((trip) => (
                <Card key={trip.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">{trip.airport}</h3>
                        <p className="text-sm text-gray-500">
                          {trip.date} at {trip.time}
                        </p>
                      </div>

                      <Button
                        className="bg-yellow-400 text-black hover:bg-yellow-500"
                        onClick={() => handleJoinTrip(trip.id)}
                        disabled={isJoining === trip.id}
                      >
                        {isJoining === trip.id ? "Joining..." : "Join This Ride"}
                      </Button>
                    </div>

                    <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Pickup</p>
                          <p className="text-gray-500">{trip.pickupLocation}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Seats</p>
                          <p className="text-gray-500">{trip.seats} available</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Requested by</p>
                          <p className="text-gray-500">{trip.userName || "Anonymous User"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No matches found</h3>
              <p className="mt-2 text-sm text-gray-500">
                There are no available trips matching your criteria at the moment.
              </p>
              <div className="mt-6">
                <Link href="/request-ride">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-500">Create Your Own Trip</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
