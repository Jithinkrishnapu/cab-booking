import type { Trip } from "./types"

// Mock data for demonstration
const mockTrips: Trip[] = [
  {
    id: "trip-1",
    userId: "demo-user",
    pickupLocation: "123 Main St, New York, NY",
    airport: "JFK International Airport",
    date: "2024-01-15",
    time: "14:30",
    seats: 2,
    isFlexible: true,
    status: "active",
    matches: ["Sarah Johnson", "Mike Chen"],
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "trip-2",
    userId: "demo-user",
    pickupLocation: "456 Oak Ave, Brooklyn, NY",
    airport: "LaGuardia Airport",
    date: "2024-01-20",
    time: "09:15",
    seats: 1,
    isFlexible: false,
    status: "pending",
    createdAt: "2024-01-12T15:30:00Z",
  },
  {
    id: "trip-3",
    userId: "other-user",
    pickupLocation: "789 Pine St, Queens, NY",
    airport: "Newark Liberty International Airport",
    date: "2024-01-18",
    time: "16:45",
    seats: 3,
    isFlexible: true,
    status: "pending",
    userName: "Alex Rodriguez",
    createdAt: "2024-01-11T12:00:00Z",
  },
]

export function getTrips(): Trip[] {
  const stored = localStorage.getItem("trips")
  if (stored) {
    return JSON.parse(stored)
  }

  // Initialize with mock data
  localStorage.setItem("trips", JSON.stringify(mockTrips))
  return mockTrips
}

export function getAllTrips(): Trip[] {
  return getTrips()
}

export function getTrip(id: string): Trip | null {
  const trips = getTrips()
  return trips.find((trip) => trip.id === id) || null
}

export function addTrip(tripData: Omit<Trip, "id" | "status" | "createdAt">): Trip {
  const trips = getTrips()
  const newTrip: Trip = {
    ...tripData,
    id: `trip-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  trips.push(newTrip)
  localStorage.setItem("trips", JSON.stringify(trips))
  return newTrip
}

export function updateTripStatus(id: string, status: Trip["status"], matchName?: string): Trip {
  const trips = getTrips()
  const tripIndex = trips.findIndex((trip) => trip.id === id)

  if (tripIndex === -1) {
    throw new Error("Trip not found")
  }

  trips[tripIndex].status = status

  if (matchName && status === "active") {
    trips[tripIndex].matches = trips[tripIndex].matches || []
    if (!trips[tripIndex].matches!.includes(matchName)) {
      trips[tripIndex].matches!.push(matchName)
    }
  }

  localStorage.setItem("trips", JSON.stringify(trips))
  return trips[tripIndex]
}

export function findMatches(trip: Trip): any[] {
  // Mock potential matches
  return [
    {
      id: "match-1",
      userName: "Emma Wilson",
      pickupLocation: "321 Broadway, New York, NY",
      airport: trip.airport,
      date: trip.date,
      time: "14:45", // 15 minutes later
      seats: 1,
      isFlexible: true,
    },
    {
      id: "match-2",
      userName: "David Kim",
      pickupLocation: "654 Park Ave, New York, NY",
      airport: trip.airport,
      date: trip.date,
      time: "14:15", // 15 minutes earlier
      seats: 2,
      isFlexible: false,
    },
  ]
}
