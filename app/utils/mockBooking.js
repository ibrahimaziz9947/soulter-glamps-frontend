// Mock bookings storage
// This is a temporary in-memory storage for demonstration purposes
// In production, this would be replaced with a database

let mockBookings = []

export function addBooking(booking) {
  const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  const newBooking = {
    id: bookingId,
    ...booking,
    createdAt: new Date().toISOString(),
  }
  mockBookings.push(newBooking)
  return newBooking
}

export function getAllBookings() {
  return mockBookings
}

export function getBookingById(id) {
  return mockBookings.find(booking => booking.id === id)
}

export function clearBookings() {
  mockBookings = []
}
