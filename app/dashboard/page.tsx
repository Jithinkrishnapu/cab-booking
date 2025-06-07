"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Plus, User } from "lucide-react"
// Remove these imports since we'll create inline components
import type { Trip } from "@/lib/types"
// import { getTrips } from "@/lib/data"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

    // Get trips data
    // Replace getTrips() call with:
    const tripsData = JSON.parse(localStorage.getItem("trips") || "[]")
    setTrips(tripsData)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 p-2 rounded-md">
              <MapPin className="h-5 w-5 text-black" />
            </div>
            <h1 className="text-xl font-bold">AirportShare</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-gray-500">Manage your trips and find ride matches</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/request-ride">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                <Plus className="mr-2 h-4 w-4" />
                New Trip Request
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Trips</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {trips.filter((trip) => trip.status === "active").length}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Matches</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {trips.filter((trip) => trip.status === "pending").length}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed Trips</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {trips.filter((trip) => trip.status === "completed").length}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active Trips</TabsTrigger>
            <TabsTrigger value="pending">Pending Matches</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {trips.filter((trip) => trip.status === "active").length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {trips
                  .filter((trip) => trip.status === "active")
                  .map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
              </div>
            ) : (
              <EmptyState
                title="No active trips"
                description="You don't have any active trips at the moment."
                action={
                  <Link href="/request-ride">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-500">Request a Ride</Button>
                  </Link>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="pending">
            {trips.filter((trip) => trip.status === "pending").length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {trips
                  .filter((trip) => trip.status === "pending")
                  .map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
              </div>
            ) : (
              <EmptyState
                title="No pending matches"
                description="You don't have any pending ride matches at the moment."
                action={
                  <Link href="/find-matches">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-500">Find Matches</Button>
                  </Link>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="completed">
            {trips.filter((trip) => trip.status === "completed").length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {trips
                  .filter((trip) => trip.status === "completed")
                  .map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
              </div>
            ) : (
              <EmptyState title="No completed trips" description="You don't have any completed trips yet." />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{trip.airport}</CardTitle>
          <div
            className={`px-2 py-1 rounded text-xs font-medium ${
              trip.status === "active"
                ? "bg-green-100 text-green-800"
                : trip.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {trip.status === "active" ? "Active" : trip.status === "pending" ? "Pending" : "Completed"}
          </div>
        </div>
        <CardDescription>Trip #{trip.id.substring(0, 8)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Pickup Location</p>
              <p className="text-sm text-gray-500">{trip.pickupLocation}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-gray-500">{trip.date}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm text-gray-500">{trip.time}</p>
            </div>
          </div>

          {trip.matches && trip.matches.length > 0 && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Matched With</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {trip.matches.map((match, index) => (
                    <div key={index} className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-full text-xs">
                      <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                      {match}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link href={`/trips/${trip.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="border rounded-lg p-8 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
        <MapPin className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
