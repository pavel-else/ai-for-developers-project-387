export const mockEventTypes = [
  { id: 1, ownerId: 1, name: '15 минут', description: 'Короткая встреча на 15 минут', duration: 15 },
  { id: 2, ownerId: 1, name: '30 минут', description: 'Стандартная встреча на 30 минут', duration: 30 },
]

export const mockCreatedEventType = {
  id: 3, ownerId: 1, name: '45 минут', description: 'Длинная встреча', duration: 45,
}

export const mockAvailableSlots = [
  { slotId: 1, startTime: '2026-07-01T10:00:00Z', endTime: '2026-07-01T10:15:00Z' },
  { slotId: 1, startTime: '2026-07-01T10:15:00Z', endTime: '2026-07-01T10:30:00Z' },
  { slotId: 2, startTime: '2026-07-02T14:00:00Z', endTime: '2026-07-02T14:15:00Z' },
]

export const mockBooking = {
  id: 1,
  slotId: 1,
  eventTypeId: 1,
  startTime: '2026-07-01T10:00:00Z',
  endTime: '2026-07-01T10:15:00Z',
  bookerName: 'Петр Иванов',
  bookerEmail: 'ivan@example.com',
  status: 'active' as const,
}

export const mockCancelledBooking = {
  ...mockBooking,
  id: 2,
  startTime: '2026-07-02T14:00:00Z',
  endTime: '2026-07-02T14:15:00Z',
  bookerName: 'Мария Иванова',
  bookerEmail: 'maria@example.com',
  status: 'cancelled' as const,
}

export const mockAdminSlots = [
  {
    id: 1, ownerId: 1, startTime: '2026-07-01T09:00:00Z', endTime: '2026-07-01T18:00:00Z',
    bookings: [
      {
        id: 1, slotId: 1, eventTypeId: 1,
        startTime: '2026-07-01T10:00:00Z', endTime: '2026-07-01T10:15:00Z',
        bookerName: 'Петр Иванов', bookerEmail: 'ivan@example.com',
        status: 'active' as const,
      },
      {
        id: 2, slotId: 1, eventTypeId: 2,
        startTime: '2026-07-01T14:00:00Z', endTime: '2026-07-01T14:30:00Z',
        bookerName: 'Мария Иванова', bookerEmail: 'maria@example.com',
        status: 'cancelled' as const,
      },
    ],
  },
  { id: 2, ownerId: 1, startTime: '2026-07-02T09:00:00Z', endTime: '2026-07-02T18:00:00Z', bookings: [] },
]

export const mockAdminBookings = [
  {
    id: 1,
    slotId: 1,
    eventTypeId: 1,
    startTime: '2026-07-01T10:00:00Z',
    endTime: '2026-07-01T10:15:00Z',
    bookerName: 'Петр Иванов',
    bookerEmail: 'ivan@example.com',
    status: 'active' as const,
  },
  {
    id: 2,
    slotId: 1,
    eventTypeId: 2,
    startTime: '2026-07-02T14:00:00Z',
    endTime: '2026-07-02T14:30:00Z',
    bookerName: 'Мария Иванова',
    bookerEmail: 'maria@example.com',
    status: 'cancelled' as const,
  },
]
