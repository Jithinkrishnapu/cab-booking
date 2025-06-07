export interface Trip {
  id: string
  userId: string
  pickupLocation: string
  airport: string
  date: string
  time: string
  seats: number
  isFlexible: boolean
  status: "pending" | "active" | "completed" | "cancelled"
  matches?: string[]
  userName?: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  password: string
}
