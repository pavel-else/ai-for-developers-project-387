import type { components } from './schema'
import { api } from './client'

export type EventType = components['schemas']['EventType']
export type EventTypeCreate = components['schemas']['EventTypeCreate']
export type EventTypeUpdate = components['schemas']['EventTypeUpdate']
export type Slot = components['schemas']['Slot']
export type SlotCreate = components['schemas']['SlotCreate']
export type Booking = components['schemas']['Booking']

export async function getEventTypes(): Promise<EventType[]> {
  return await api.get('admin/event-types').json()
}

export async function createEventType(body: EventTypeCreate): Promise<EventType> {
  return await api.post('admin/event-types', { json: body }).json()
}

export async function updateEventType(id: number, body: EventTypeUpdate): Promise<EventType> {
  return await api.put(`admin/event-types/${id}`, { json: body }).json()
}

export async function deleteEventType(id: number): Promise<void> {
  await api.delete(`admin/event-types/${id}`)
}

export async function getSlots(): Promise<Slot[]> {
  return await api.get('admin/slots').json()
}

export async function createSlot(body: SlotCreate): Promise<Slot> {
  return await api.post('admin/slots', { json: body }).json()
}

export async function deleteSlot(id: number): Promise<void> {
  await api.delete(`admin/slots/${id}`)
}

export async function getBookings(): Promise<Booking[]> {
  return await api.get('admin/bookings').json()
}

export async function cancelBooking(id: number): Promise<Booking> {
  return await api.patch(`admin/bookings/${id}/cancel`).json()
}
