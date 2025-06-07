"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2 } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { addTrip } from "@/lib/data"

const airports = [
  "JFK International Airport",
  "LaGuardia Airport",
  "Newark Liberty International Airport",
  "Los Angeles International Airport",
  "O'Hare International Airport",
  "Hartsfield-Jackson Atlanta International Airport",
  "San Francisco International Airport",
  "Denver International Airport",
]

export default function RequestRidePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    pickupLocation: "",
    airport: "",
    date: "",
    time: "",
    seats: "1",
    isFlexible: false,
  })

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
      setIsLoading(false)
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isFlexible: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Add trip to local storage
      const newTrip = addTrip({
        pickupLocation: formData.pickupLocation,
        airport: formData.airport,
        date: formData.date,
        time: formData.time,
        seats: Number.parseInt(formData.seats),
        isFlexible: formData.isFlexible,
        userId: user.id,
      })

      setIsSubmitting(false)
      router.push(`/trips/${newTrip.id}`)
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
          <p className="mt-4 text-gray-500">Loading...</p>
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

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Request a Ride</CardTitle>
              <CardDescription>Fill in the details of your trip to find potential ride matches</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Input
                      id="pickupLocation"
                      name="pickupLocation"
                      placeholder="Enter your address"
                      required
                      value={formData.pickupLocation}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="airport">Airport</Label>
                    <Select
                      value={formData.airport}
                      onValueChange={(value) => handleSelectChange("airport", value)}
                      required
                    >
                      <SelectTrigger id="airport">
                        <SelectValue placeholder="Select an airport" />
                      </SelectTrigger>
                      <SelectContent>
                        {airports.map((airport) => (
                          <SelectItem key={airport} value={airport}>
                            {airport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" name="date" type="date" required value={formData.date} onChange={handleChange} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" name="time" type="time" required value={formData.time} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="seats">Number of Seats Needed</Label>
                    <Select
                      value={formData.seats}
                      onValueChange={(value) => handleSelectChange("seats", value)}
                      required
                    >
                      <SelectTrigger id="seats">
                        <SelectValue placeholder="Select number of seats" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="isFlexible" checked={formData.isFlexible} onCheckedChange={handleCheckboxChange} />
                    <Label htmlFor="isFlexible" className="text-sm font-normal">
                      I'm flexible by ±30 minutes
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-gray-500">
                Your request will be matched with other travelers going to the same airport.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
