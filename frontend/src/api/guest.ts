import type { components } from './schema'
import { api } from './client'
import { config } from './config'

export type EventType = components['schemas']['EventType']
export type Slot = components['schemas']['Slot']
export type Booking = components['schemas']['Booking']
export type BookingCreate = components['schemas']['BookingCreate']

export interface AvailableSlot {
  slotId: number
  startTime: string
  endTime: string
}

export async function getEventTypes(): Promise<EventType[]> {
  return await api.get('event-types').json()
}

export async function getSlots(duration: number): Promise<AvailableSlot[]> {
  return await api.get(`${config.ownerSlug}/slots`, {
    searchParams: { duration },
  }).json()
}

export async function createBooking(body: BookingCreate): Promise<Booking> {
  return await api.post('bookings', { json: body }).json()
}

export async function getMyBookings(email: string): Promise<Booking[]> {
  return await api.get('bookings', { searchParams: { email } }).json()
}

export async function cancelBooking(id: number, email: string): Promise<Booking> {
  return await api.patch(`bookings/${id}/cancel`, { json: { email } }).json()
}
