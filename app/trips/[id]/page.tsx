"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, MapPin, Phone, User, Users } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import type { Trip } from "@/lib/types"
import { getTrip, updateTripStatus, findMatches } from "@/lib/data"

export default function TripDetailPage() {
  const router = useRouter()
  const params = useParams()
  const tripId = params.id as string

  const [user, setUser] = useState<any>(null)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [potentialMatches, setPotentialMatches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

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

    // Get trip data
    const tripData = getTrip(tripId)
    if (!tripData) {
      router.push("/dashboard")
      return
    }

    setTrip(tripData)

    // Get potential matches
    if (tripData.status === "pending") {
      const matches = findMatches(tripData)
      setPotentialMatches(matches)
    }

    setIsLoading(false)
  }, [router, tripId])

  const handleCancelTrip = () => {
    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      updateTripStatus(tripId, "cancelled")
      router.push("/dashboard")
    }, 1000)
  }

  const handleAcceptMatch = (matchId: string) => {
    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      const updatedTrip = updateTripStatus(tripId, "active", matchId)
      setTrip(updatedTrip)
      setPotentialMatches([])
      setIsUpdating(false)
    }, 1000)
  }

  const handleCompleteTrip = () => {
    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      updateTripStatus(tripId, "completed")
      router.push("/dashboard")
    }, 1000)
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
          <p className="mt-4 text-gray-500">Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium">Trip not found</p>
          <Link href="/dashboard" className="mt-4 inline-block text-yellow-500 hover:underline">
            Return to Dashboard
          </Link>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Trip to {trip.airport}</h1>
              <p className="text-gray-500">Trip #{tripId.substring(0, 8)}</p>
            </div>
            <div
              className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
                trip.status === "active"
                  ? "bg-green-100 text-green-800"
                  : trip.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : trip.status === "completed"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
              }`}
            >
              {trip.status === "active"
                ? "Active"
                : trip.status === "pending"
                  ? "Pending"
                  : trip.status === "completed"
                    ? "Completed"
                    : "Cancelled"}
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Information about your trip request</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Pickup Location</p>
                      <p className="text-gray-700">{trip.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-gray-700">{trip.airport}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-gray-700">{trip.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-gray-700">
                        {trip.time} {trip.isFlexible ? "(±30 min flexible)" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Seats</p>
                      <p className="text-gray-700">{trip.seats}</p>
                    </div>
                  </div>
                </div>
              </div>

              {trip.status === "active" && trip.matches && trip.matches.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Matched Travelers</h3>
                  <div className="space-y-4">
                    {trip.matches.map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{match}</p>
                            <p className="text-sm text-gray-500">Matched on {new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-4">
                {trip.status === "pending" && (
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleCancelTrip}
                    disabled={isUpdating}
                  >
                    Cancel Trip
                  </Button>
                )}

                {trip.status === "active" && (
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleCompleteTrip}
                    disabled={isUpdating}
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {trip.status === "pending" && potentialMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Potential Matches</CardTitle>
                <CardDescription>These travelers are going to the same airport at a similar time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {potentialMatches.map((match) => (
                    <div key={match.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{match.userName}</p>
                            <p className="text-sm text-gray-500">
                              {match.date} at {match.time}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" size="sm" onClick={() => {}}>
                            View Details
                          </Button>
                          <Button
                            className="bg-yellow-400 text-black hover:bg-yellow-500"
                            size="sm"
                            onClick={() => handleAcceptMatch(match.id)}
                            disabled={isUpdating}
                          >
                            Accept Match
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Pickup Location</p>
                          <p className="text-gray-500">{match.pickupLocation}</p>
                        </div>
                        <div>
                          <p className="font-medium">Seats Needed</p>
                          <p className="text-gray-500">{match.seats}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
